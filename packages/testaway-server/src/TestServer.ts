import * as chokidar from 'chokidar';
import * as express from 'express';
import * as webpack from 'webpack';
import MemoryFs = require('memory-fs');
import * as WebSocket from 'ws';
import * as http from 'http';
import { BrowserTestRunner } from './BrowserTestRunner';
import { toHtml } from './runner-template';

export default class TestServer {
  options: any;
  fs: MemoryFs;
  bundleCache: Map<string, webpack.Compiler.Watching>;
  app: express.Express;
  server: http.Server;
  wss: WebSocket.Server;
  runner: BrowserTestRunner;

  static create(options: any) {
    return new TestServer(options);
  }

  constructor(options: any) {
    this.options = options;
    this.fs = new MemoryFs();
    this.bundleCache = new Map<string, webpack.Compiler.Watching>();
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    this.runner = new BrowserTestRunner();
    this.initializeRoutes();
    this.initializeWebSocket();

    this.runner.init().then(() => {
      console.log('puppeteer launched!');
    });
  }

  messageClient(client: WebSocket, data: any) {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
  }

  messageAllClients(data: any) {
    this.wss.clients.forEach(client => this.messageClient(client, data));
  }

  initializeRoutes() {
    this.app.get('/run/*', (req, res) => {
      const fileName = req.params[0];
      this.fs.readFile(`/bundles/${fileName}`, (error, result) => {
        if (error) {
          res.send('File not found: ' + fileName);
          return;
        }

        res.send(toHtml({ script: result, port: this.options.port }));
      });
    });
  }

  initializeWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      this.messageClient(ws, this.listFilesEvent());

      ws.on('message', (message: string) => {
        const event = JSON.parse(message);

        if (event.type === 'run_test_file') {
          console.log('requested to run file:', event.file);
          this.runner.runFile(event.file);
        } else if (event.type === 'test_finished') {
          this.messageAllClients(event);
        }
      });
    });
  }

  addFile(fullPath: string) {
    const partialPath = fullPath.replace(this.options.rootDir, '').replace(/^\/+/, '');
    this.bundleCache.delete(partialPath);

    console.log('File added:', partialPath);

    const compiler = webpack({
      mode: 'development',
      entry: fullPath,
      watch: true,
      output: {
        path: '/bundles',
        filename: partialPath
      },
      optimization: {
        noEmitOnErrors: true
      }
    });

    compiler.outputFileSystem = this.fs;

    compiler.hooks.done.tap('done', stats => {
      this.messageAllClients({
        type: 'recompilation',
        file: `/bundles/${partialPath}`,
        stats: stats.toJson()
      });
    });

    const watching = compiler.watch({}, (error, stats) => {
      console.log('Compiling', partialPath);
      if (error) console.error(error);
      // console.log(stats.toString());
    });

    this.bundleCache.set(partialPath, watching);
    this.messageAllClients(this.listFilesEvent());
  }

  removeFile(fullPath: string) {
    const partialPath = fullPath.replace(this.options.rootDir, '').replace(/^\/+/, '');

    const watching = this.bundleCache.get(partialPath);
    if (watching) {
      watching.close(() => {
        console.log('Stopped watching file', partialPath);
      });
    }

    console.log('File deleted:', partialPath);
    this.bundleCache.delete(partialPath);
    this.messageAllClients(this.listFilesEvent());
  }

  listFilesEvent() {
    return {
      type: 'list_files',
      files: Array.from(this.bundleCache.keys())
    };
  }

  start() {
    const { rootDir, testFilePattern, port } = this.options;
    this.bundleCache.clear();

    chokidar
      .watch(testFilePattern.replace('<rootDir>', rootDir), {
        ignored: /node_modules|^\./
      })
      .on('add', path => this.addFile(path))
      .on('unlink', path => this.removeFile(path));

    this.server.listen(port, () => {
      console.log(`Test server listening on port ${port}!`);
    });
  }
}

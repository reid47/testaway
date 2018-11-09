import * as express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';
import { BrowserTestRunner } from './BrowserTestRunner';
import { FileServer } from './FileServer';
import { executeTemplate, analyzeTemplate } from './html-templates';

interface TestFileDefinition {
  fileName: string;
  root: SuiteDefinition;
}

interface TestDefinition {
  name: string[];
  category: any;
}

interface SuiteDefinition {
  name: string[];
  tests: TestDefinition[];
  suites: SuiteDefinition[];
}

export class TestServer {
  options: any;
  fileServer: FileServer;
  app: express.Express;
  server: http.Server;
  wss: WebSocket.Server;
  runner: BrowserTestRunner;
  testFileDefinitions: Map<string, TestFileDefinition>;

  static create(options: any) {
    return new TestServer(options);
  }

  constructor(options: any) {
    this.options = options;
    this.testFileDefinitions = new Map<string, TestFileDefinition>();
    this.fileServer = new FileServer(this, options);
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    this.runner = new BrowserTestRunner(options);

    this.runner.init().then(() => {
      console.log('puppeteer launched!');
    });

    this.app.get('/run/*', (req, res) => {
      const fileName = req.params[0];
      this.fileServer
        .getFile(fileName)
        .then((script: string) => res.send(executeTemplate({ script, port: this.options.port })))
        .catch(() => res.status(404).send('File not found: ' + fileName));
    });

    this.app.get('/analyze/*', (req, res) => {
      const fileName = req.params[0];
      this.fileServer
        .getFile(fileName)
        .then((script: string) =>
          res.send(
            analyzeTemplate({
              fileName,
              script,
              port: this.options.port
            })
          )
        )
        .catch(() => res.status(404).send('File not found: ' + fileName));
    });

    this.wss.on('connection', ws => {
      this.handleConnection(ws);
      ws.on('message', this.handleMessage.bind(this));
    });
  }

  notifyClient(client: WebSocket, data: any) {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
  }

  notifyClients(data: any) {
    this.wss.clients.forEach(client => this.notifyClient(client, data));
  }

  handleConnection(ws: WebSocket) {
    const fileNames = this.fileServer.getFileNames();

    this.notifyClient(ws, {
      type: 'connected',
      fileNames,
      fileDefinitions: fileNames.reduce(
        (acc, fileName) => ({
          ...acc,
          [fileName]: this.testFileDefinitions.get(fileName)
        }),
        {}
      )
    });
  }

  handleMessage(message: string) {
    const event = JSON.parse(message);
    console.log(event);

    if (event.type === 'run_test_file') {
      return this.runner.runFile(event.file);
    }

    if (event.type === 'test_finished') {
      return this.notifyClients(event);
    }

    if (event.type === 'runDefined') {
      const { fileName, data } = event;
      this.testFileDefinitions.set(fileName, data);

      return this.notifyClients({
        type: 'fileAnalyzed',
        fileName,
        data
      });
    }
  }

  start() {
    const { port } = this.options;
    this.fileServer.startWatching();
    this.server.listen(port, () => {
      console.log(`Test server listening on port ${port}!`);
    });
  }
}

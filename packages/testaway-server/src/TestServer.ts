import * as express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';
import { BrowserTestRunner } from './BrowserTestRunner';
import { FileServer } from './FileServer';
import { toHtml } from './runner-template';

export class TestServer {
  options: any;
  fileServer: FileServer;
  app: express.Express;
  server: http.Server;
  wss: WebSocket.Server;
  runner: BrowserTestRunner;

  static create(options: any) {
    return new TestServer(options);
  }

  constructor(options: any) {
    this.options = options;
    this.fileServer = new FileServer(this, options);
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    this.runner = new BrowserTestRunner();

    this.runner.init().then(() => {
      console.log('puppeteer launched!');
    });

    this.app.get('/run/*', (req, res) => {
      const fileName = req.params[0];
      this.fileServer
        .getFile(fileName)
        .then((script: string) => res.send(toHtml({ script, port: this.options.port })))
        .catch(() => res.status(404).send('File not found: ' + fileName));
    });

    this.wss.on('connection', (ws: WebSocket) => {
      this.handleConnection(ws);
      ws.on('message', (message: string) => this.handleMessage(JSON.parse(message)));
    });
  }

  notifyClient(client: WebSocket, data: any) {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
  }

  notifyClients(data: any) {
    this.wss.clients.forEach(client => this.notifyClient(client, data));
  }

  handleConnection(ws: WebSocket) {
    this.notifyClient(ws, this.fileServer.listFilesEvent());
  }

  handleMessage(event: any) {
    if (event.type === 'run_test_file') {
      this.runner.runFile(event.file);
    } else if (event.type === 'test_finished') {
      this.notifyClients(event);
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

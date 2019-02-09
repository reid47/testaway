import fs from 'fs';
import path from 'path';

const testawayCore = fs
  .readFileSync(path.resolve(__dirname, '../../testaway-core/dist/index.min.js'))
  .toString();

export function executeTemplate({
  fileName,
  script,
  port
}: {
  fileName: string;
  script: string;
  port: number;
}) {
  return `<!doctype html><html><head><script type="text/javascript">
    ${testawayCore}

    Testaway.socket = new WebSocket('ws://localhost:${port}/socket');

    Testaway.currentRun = Testaway({
      reporters: [{
        testFinished: function(event) {
          Testaway.socket.send(JSON.stringify({
            type: 'testFinished',
            fileName: ${JSON.stringify(fileName)},
            data: event
          }));
        }
      }]
    });

    Object.keys(Testaway.currentRun).forEach(function (key) {
      if (key === 'execute') {
        window.Testaway[key] = Testaway.currentRun[key];
        return;
      }

      window[key] = Testaway.currentRun[key];
    });

    ${script}

    Testaway.socket.onopen = function() {
      window.Testaway.execute();
    };
  </script></head><body></body></html>`;
}

export function analyzeTemplate({
  fileName,
  script,
  port
}: {
  fileName: string;
  script: string;
  port: number;
}) {
  return `<!doctype html><html><head><script type="text/javascript">
    ${testawayCore}

    Testaway.socket = new WebSocket('ws://localhost:${port}/socket');

    Testaway.currentRun = Testaway({
      reporters: [{
        runDefined: function(event) {
          Testaway.socket.send(JSON.stringify({
            type: 'runDefined',
            fileName: ${JSON.stringify(fileName)},
            data: event
          }));
        }
      }]
    });

    Object.keys(Testaway.currentRun).forEach(function (key) {
      if (key === 'execute') return;
      window[key] = Testaway.currentRun[key];
    });

    ${script}

    Testaway.socket.onopen = function() {
      window.Testaway.currentRun.analyze();
    };
  </script></head><body></body></html>`;
}

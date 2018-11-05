import * as fs from 'fs';
import * as path from 'path';

const testawayCore = fs
  .readFileSync(path.resolve(__dirname, '../../testaway-core/dist/index.min.js'))
  .toString();

export function toHtml({ script, port }: { script: string; port: number }) {
  return `<!doctype html><html><head><script type="text/javascript">
    ${testawayCore}

    Testaway.runId = (new Date()).getTime();
    Testaway.socket = new WebSocket('ws://localhost:${port}/socket');

    Testaway.socketReporter = {
      testFinished: function(event) {
        Testaway.socket.send(JSON.stringify({
          type: 'test_finished', data: event
        }));
      }
    };

    Testaway.currentRun = Testaway({
      reporters: [Testaway.socketReporter]
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

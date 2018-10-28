import { Reporter, RunStartedEvent, TestFinishedEvent } from '../core/types';

const out = (str: string) => process.stdout.write(str + '\n');

export default class TapReporter implements Reporter {
  private finishedTestCount: number;

  constructor() {
    this.finishedTestCount = 0;
  }

  runStarted(event: RunStartedEvent) {
    out('TAP version 13');
    out(`1..${event.testCount}`);
  }

  testFinished(event: TestFinishedEvent) {
    const testName = event.testName.join(' > ');
    const testNumber = ++this.finishedTestCount;

    switch (event.status) {
      case 'passed':
        out(`ok ${testNumber} ${testName}`);
        break;

      case 'failed':
        out(`not ok ${testNumber} ${testName}`);
        break;

      case 'skipped':
        out(`ok ${testNumber} ${testName} # SKIP`);
        break;
    }
  }
}

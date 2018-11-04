import { Reporter, TestFinishedEvent, RunStartedEvent, RunFinishedEvent } from './types';

export default class SimpleReporter implements Reporter {
  testCount: number = 0;
  passCount: number = 0;
  failCount: number = 0;
  skipCount: number = 0;

  runStarted(event: RunStartedEvent) {
    this.testCount = event.testCount;
    console.info();
  }

  testFinished(event: TestFinishedEvent) {
    const testName = event.testName.join(' > ');

    switch (event.status) {
      case 'passed':
        this.passCount++;
        console.info('\u2713', testName);
        return;

      case 'failed':
        this.failCount++;
        console.error(
          '\u2717',
          testName +
            '\n' +
            (event.error && event.error.message
              ? '\n' +
                event.error.message
                  .split('\n')
                  .map(line => `  ${line}`)
                  .join('\n')
              : '') +
            (event.error && event.error.stack
              ? '\n' +
                event.error.stack
                  .split('\n')
                  .map(line => `  ${line}`)
                  .join('\n')
              : '')
        );
        return;

      case 'skipped':
        this.skipCount++;
        console.info('\u003f', testName);
        return;
    }
  }

  runFinished(event: RunFinishedEvent) {
    const runCount = this.passCount + this.failCount + this.skipCount;

    console.info(
      [
        '\nran ',
        runCount < this.testCount ? `${runCount}/${this.testCount}` : 'all',
        ` tests in ${event.time / 1000}s`,
        '\n',
        this.passCount && `passed: ${this.passCount}/${runCount}`,
        this.failCount && `failed: ${this.failCount}/${runCount}`,
        this.skipCount && `skipped: ${this.skipCount}/${runCount}`
      ]
        .filter(Boolean)
        .join('')
    );

    if (this.failCount && typeof process !== 'undefined' && typeof process.exit === 'function') {
      process.exit(1);
    }
  }
}

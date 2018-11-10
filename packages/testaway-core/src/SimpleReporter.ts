import { Reporter, TestFinishedEvent, RunStartedEvent, RunFinishedEvent } from './types';

export class SimpleReporter implements Reporter {
  testCount: number = 0;
  passCount: number = 0;
  failCount: number = 0;

  runStarted(event: RunStartedEvent) {
    this.testCount = event.testCount;
    console.info();
  }

  testFinished(event: TestFinishedEvent) {
    const testName = event.testName.join(' > ');

    switch (event.status) {
      case 'passed':
        this.passCount++;
        console.info(`\u2713 ${testName}`);
        return;

      case 'failed':
        this.failCount++;
        console.error(
          `\u2717 ${testName}\n` +
            (event.error
              ? '\n' +
                event.error
                  .split('\n')
                  .map(line => `  ${line}`)
                  .join('\n')
              : '')
        );
        return;
    }
  }

  runFinished(event: RunFinishedEvent) {
    const runCount = this.passCount + this.failCount;
    const skipCount = this.testCount - runCount;

    console.info(
      [
        '\nran ',
        runCount < this.testCount ? `${runCount}/${this.testCount}` : 'all',
        ` tests in ${event.time / 1000}s`,
        '\n',
        this.passCount && `\npassed: ${this.passCount}/${runCount}`,
        this.failCount && `\nfailed: ${this.failCount}/${runCount}`,
        skipCount && `\nskipped: ${skipCount}/${this.testCount}`
      ]
        .filter(Boolean)
        .join('')
    );

    if (this.failCount && typeof process !== 'undefined' && typeof process.exit === 'function') {
      process.exit(1);
    }
  }
}

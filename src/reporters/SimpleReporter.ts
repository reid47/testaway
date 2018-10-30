import { Reporter, TestFinishedEvent } from '../core/types';

export default class SimpleReporter implements Reporter {
  passCount: number = 0;
  failCount: number = 0;
  skipCount: number = 0;

  testFinished(event: TestFinishedEvent) {
    const testName = event.testName.join(' > ');

    switch (event.status) {
      case 'passed':
        this.passCount++;
        console.info('\u2713', testName);
        return;

      case 'failed':
        this.failCount++;
        console.info('\u2717', testName);

        if (event.error && event.error.message) {
          console.info(
            event.error.message
              .split('\n')
              .map(line => `  ${line}`)
              .join('\n')
          );
        }

        if (event.error && event.error.stack) {
          console.info(
            '\n' +
              event.error.stack
                .split('\n')
                .map(line => `  ${line}`)
                .join('\n')
          );
        }
        return;

      case 'skipped':
        this.skipCount++;
        console.info('\u003f', testName);
        return;
    }
  }

  runFinished() {
    const total = this.passCount + this.failCount + this.skipCount;

    console.info();
    this.passCount && console.info(`passed: ${this.passCount}/${total}`);
    this.failCount && console.info(`failed: ${this.failCount}/${total}`);
    this.skipCount && console.info(`skipped: ${this.skipCount}/${total}`);

    if (this.failCount && typeof process !== 'undefined') {
      process.exit(1);
    }
  }
}

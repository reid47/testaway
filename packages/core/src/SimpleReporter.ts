import { Reporter, TestFinishedEvent } from './types';

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

  runFinished() {
    const total = this.passCount + this.failCount + this.skipCount;

    console.info(
      [
        this.passCount && `passed: ${this.passCount}/${total}`,
        this.failCount && `failed: ${this.failCount}/${total}`,
        this.skipCount && `skipped: ${this.skipCount}/${total}`
      ]
        .filter(Boolean)
        .join('\n')
    );

    if (this.failCount && typeof process !== 'undefined' && typeof process.exit === 'function') {
      process.exit(1);
    }
  }
}

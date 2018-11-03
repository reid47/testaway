import TestSuite from './TestSuite';
import { TestFunc, TestStatus, TestOptions } from './types';
import TestRun from './TestRun';
import { mergeTestOptionsWithDefaults } from './options';

export default class Test {
  testRun: TestRun;
  parent: TestSuite;
  name: string[];
  func: TestFunc;
  options: TestOptions;

  constructor(
    testRun: TestRun,
    parent: TestSuite,
    name: string[],
    func: TestFunc,
    options?: TestOptions
  ) {
    this.testRun = testRun;
    this.parent = parent;
    this.name = name;
    this.func = func;
    this.options = mergeTestOptionsWithDefaults(this.testRun.options, parent.options, options);
  }

  async execute() {
    this.testRun.reportTestStarted({
      testName: this.name
    });

    const startTime = Date.now();
    let status: TestStatus = 'skipped';
    let error;

    try {
      const timeoutError = new Error('Timed out!');

      await new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => reject(timeoutError), this.options.timeout);

        if (this.func.length === 0) {
          try {
            await this.func();
            clearTimeout(timeout);
            resolve();
          } catch (error) {
            clearTimeout(timeout);
            reject(error);
          }
        } else {
          this.func(error => {
            clearTimeout(timeout);
            if (error) reject(error);
            else resolve();
          });
        }
      });

      status = 'passed';
    } catch (err) {
      status = 'failed';
      error = err;
    }

    this.testRun.reportTestFinished({
      testName: this.name,
      time: Date.now() - startTime,
      status,
      error
    });
  }
}

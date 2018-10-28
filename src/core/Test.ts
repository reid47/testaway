import TestSuite from './TestSuite';
import { TestFunc, TestStatus } from './types';
import TestRun from './TestRun';

export default class Test {
  testRun: TestRun;
  parent: TestSuite;
  name: string[];
  func: TestFunc;

  constructor(testRun: TestRun, parent: TestSuite, name: string[], func: TestFunc) {
    this.testRun = testRun;
    this.parent = parent;
    this.name = name;
    this.func = func;
  }

  async execute() {
    this.testRun.reportTestStarted({
      testName: this.name
    });

    const startTime = Date.now();
    let status: TestStatus = 'skipped';
    let error;

    try {
      await (this.func.length === 0
        ? this.func()
        : new Promise((resolve, reject) => {
            this.func(error => (error ? reject(error) : resolve()));
          }));

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

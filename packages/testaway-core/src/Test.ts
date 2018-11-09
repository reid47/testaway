import TestSuite from './TestSuite';
import { TestFunc, TestStatus, TestOptions, TestCategory, TestDefinition } from './types';
import TestRun from './TestRun';
import { mergeTestOptionsWithDefaults } from './options';

export default class Test {
  id: string;
  testRun: TestRun;
  parent: TestSuite;
  name: string[];
  func: TestFunc;
  category: TestCategory;
  options: TestOptions;

  constructor(
    testRun: TestRun,
    parent: TestSuite,
    name: string[],
    func: TestFunc,
    category: TestCategory,
    options?: TestOptions
  ) {
    this.id = testRun.getTestId(name);
    this.testRun = testRun;
    this.parent = parent;
    this.name = name;
    this.func = func;
    this.category = category;
    this.options = mergeTestOptionsWithDefaults(this.testRun.options, parent.options, options);
  }

  analyze(): TestDefinition {
    return {
      id: this.id,
      name: this.name,
      category: this.category
    };
  }

  async execute() {
    this.testRun.reportTestStarted({
      testId: this.id,
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
      testId: this.id,
      testName: this.name,
      time: Date.now() - startTime,
      status,
      error
    });
  }
}

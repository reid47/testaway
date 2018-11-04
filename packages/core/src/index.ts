import TestRun from './TestRun';
import { Hook, TestFunc, TestOptions, TestRunOptions } from './types';
import { Expectation } from './Expectation';

export default function createTestRun(testRunOptions?: TestRunOptions) {
  const testRun = new TestRun(testRunOptions);

  const describe = (suiteName: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => {
    const suiteFunc = typeof funcOrOptions === 'function' ? funcOrOptions : func;
    const options = typeof funcOrOptions === 'function' ? {} : funcOrOptions;
    testRun.addSuite(suiteName, suiteFunc, options);
  };

  const it = (testName: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => {
    const testFunc = typeof funcOrOptions === 'function' ? funcOrOptions : func;
    const options = typeof funcOrOptions === 'function' ? {} : funcOrOptions;
    testRun.addTest(testName, testFunc, options);
  };

  return {
    execute: () => testRun.execute(),
    beforeEach: (func: TestFunc) => testRun.addHook(Hook.beforeEach, func),
    afterEach: (func: TestFunc) => testRun.addHook(Hook.afterEach, func),
    beforeAll: (func: TestFunc) => testRun.addHook(Hook.beforeAll, func),
    afterAll: (func: TestFunc) => testRun.addHook(Hook.afterAll, func),
    expect: (obj: any) => new Expectation(obj),
    describe,
    it,
    test: it
  };
}

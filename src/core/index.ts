import TestRun from './TestRun';
import { Hook, TestFunc, TestOptions, TestRunOptions } from './types';

export default function createTestRun(testRunOptions?: TestRunOptions) {
  const testRun = new TestRun(testRunOptions);

  const execute = () => testRun.execute();
  const beforeEach = (func: TestFunc) => testRun.addHook(Hook.beforeEach, func);
  const afterEach = (func: TestFunc) => testRun.addHook(Hook.afterEach, func);
  const beforeAll = (func: TestFunc) => testRun.addHook(Hook.beforeAll, func);
  const afterAll = (func: TestFunc) => testRun.addHook(Hook.afterAll, func);

  const describe = (suiteName: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => {
    if (typeof funcOrOptions === 'function') {
      testRun.addSuite(suiteName, funcOrOptions, {});
    } else {
      testRun.addSuite(suiteName, func, funcOrOptions);
    }
  };

  const it = (testName: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => {
    if (typeof funcOrOptions === 'function') {
      testRun.addTest(testName, funcOrOptions, {});
    } else {
      testRun.addTest(testName, func, funcOrOptions);
    }
  };

  return {
    execute,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll,
    describe,
    it
  };
}

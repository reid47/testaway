import TestRun from './TestRun';
import { Hook, TestFunc, TestOptions, TestRunOptions } from './types';

export default function createTestRun(testRunOptions?: TestRunOptions) {
  const testRun = new TestRun(testRunOptions);

  const beforeEach = (func: TestFunc) => {
    testRun.addHook(Hook.beforeEach, func);
  };

  const afterEach = (func: TestFunc) => {
    testRun.addHook(Hook.afterEach, func);
  };

  const beforeAll = (func: TestFunc) => {
    testRun.addHook(Hook.beforeAll, func);
  };

  const afterAll = (func: TestFunc) => {
    testRun.addHook(Hook.afterAll, func);
  };

  const it = (testName: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => {
    if (typeof funcOrOptions === 'function') {
      testRun.addTest(testName, funcOrOptions, {});
    } else {
      testRun.addTest(testName, func, funcOrOptions);
    }
  };

  const describe = (suiteName: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => {
    if (typeof funcOrOptions === 'function') {
      testRun.addSuite(suiteName, funcOrOptions, {});
    } else {
      testRun.addSuite(suiteName, func, funcOrOptions);
    }
  };

  const execute = () => testRun.execute();

  return {
    beforeEach,
    afterEach,
    beforeAll,
    afterAll,
    it,
    describe,
    execute
  };
}

import TestRun from './TestRun';
import { Hook, TestFunc, TestOptions, TestRunOptions, TestCategory } from './types';
import { Expectation } from './Expectation';
import { SimpleReporter } from './SimpleReporter';

export default function createTestRun(testRunOptions?: TestRunOptions) {
  const testRun = new TestRun(testRunOptions);

  const addSuite = (category: TestCategory) => (
    suiteName: string,
    funcOrOptions: TestFunc | TestOptions,
    func: TestFunc
  ) => {
    const suiteFunc = typeof funcOrOptions === 'function' ? funcOrOptions : func;
    const options = typeof funcOrOptions === 'function' ? {} : funcOrOptions;
    testRun.addSuite(suiteName, suiteFunc, category, options);
  };

  const addTest = (category: TestCategory) => (
    testName: string,
    funcOrOptions: TestFunc | TestOptions,
    func: TestFunc
  ) => {
    const testFunc = typeof funcOrOptions === 'function' ? funcOrOptions : func;
    const options = typeof funcOrOptions === 'function' ? {} : funcOrOptions;
    testRun.addTest(testName, testFunc, category, options);
  };

  const describe = addSuite(TestCategory.default);
  const fdescribe = addSuite(TestCategory.focused);
  const xdescribe = addSuite(TestCategory.skipped);
  const it = addTest(TestCategory.default);
  const fit = addTest(TestCategory.focused);
  const xit = addTest(TestCategory.skipped);

  return {
    execute: () => testRun.execute(),
    beforeEach: (func: TestFunc) => testRun.addHook(Hook.beforeEach, func),
    afterEach: (func: TestFunc) => testRun.addHook(Hook.afterEach, func),
    beforeAll: (func: TestFunc) => testRun.addHook(Hook.beforeAll, func),
    afterAll: (func: TestFunc) => testRun.addHook(Hook.afterAll, func),
    describe,
    fdescribe,
    xdescribe,
    suite: describe,
    fsuite: fdescribe,
    xsuite: xdescribe,
    it,
    fit,
    xit,
    test: it,
    ftest: fit,
    xtest: xit,
    expect: (obj: any) => new Expectation(obj),
    SimpleReporter
  };
}

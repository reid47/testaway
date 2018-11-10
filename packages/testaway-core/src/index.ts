import TestRun from './TestRun';
import { Testaway, Hook, TestFunc, TestOptions, TestRunOptions, TestCategory } from './types';
import { Expectation } from './Expectation';
import { SimpleReporter } from './SimpleReporter';
import { MockFactory } from './MockFactory';

export default function createTestRun(testRunOptions?: TestRunOptions): Testaway {
  const testRun = new TestRun(testRunOptions);

  const add = (suite: boolean, category: TestCategory) => (
    name: string,
    funcOrOptions: TestFunc | TestOptions,
    func: TestFunc
  ) => {
    const actualFunc = typeof funcOrOptions === 'function' ? funcOrOptions : func;
    const options = typeof funcOrOptions === 'function' ? {} : funcOrOptions;
    if (suite) testRun.addSuite(name, actualFunc, category, options);
    else testRun.addTest(name, actualFunc, category, options);
  };

  const analyze = () => testRun.analyze();
  const execute = () => testRun.execute();
  const expect = (obj: any) => new Expectation(obj);

  const beforeEach = (func: TestFunc) => testRun.addHook(Hook.beforeEach, func);
  const afterEach = (func: TestFunc) => testRun.addHook(Hook.afterEach, func);
  const beforeAll = (func: TestFunc) => testRun.addHook(Hook.beforeAll, func);
  const afterAll = (func: TestFunc) => testRun.addHook(Hook.afterAll, func);

  const describe = add(true, TestCategory.default);
  const fdescribe = add(true, TestCategory.focused);
  const xdescribe = add(true, TestCategory.skipped);

  const it = add(false, TestCategory.default);
  const fit = add(false, TestCategory.focused);
  const xit = add(false, TestCategory.skipped);

  return {
    analyze,
    execute,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll,
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
    expect,
    SimpleReporter,
    mock: MockFactory
  };
}

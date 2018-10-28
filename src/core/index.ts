import TestRun from './TestRun';
import { Hook, Options, MergedOptions } from './types';

function mergeOptions(options: Options): MergedOptions {
  options.reporters = options.reporters || [];
  return options as MergedOptions;
}

export default function createTestRun(options: Options = {}) {
  const testRun = new TestRun(mergeOptions(options));

  return {
    beforeEach: testRun.addHook.bind(testRun, Hook.beforeEach),
    afterEach: testRun.addHook.bind(testRun, Hook.afterEach),
    beforeAll: testRun.addHook.bind(testRun, Hook.beforeAll),
    afterAll: testRun.addHook.bind(testRun, Hook.afterAll),
    it: testRun.addTest.bind(testRun),
    describe: testRun.addSuite.bind(testRun),
    execute: testRun.execute.bind(testRun)
  };
}

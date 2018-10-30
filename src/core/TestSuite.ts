import Test from './Test';
import { TestFunc, Hook, TestOptions, SuiteOptions } from './types';
import TestRun from './TestRun';
import { mergeSuiteOptionsWithDefaults } from './options';

export default class TestSuite {
  testRun: TestRun;
  parent: TestSuite | null;
  name: string[];
  options: SuiteOptions;
  tests: Test[];
  suites: TestSuite[];
  hooks: { [hook in Hook]: TestFunc[] };

  constructor(testRun: TestRun, parent: TestSuite | null, name: string[], options?: SuiteOptions) {
    this.testRun = testRun;
    this.parent = parent;
    this.name = name;
    this.options = mergeSuiteOptionsWithDefaults(
      this.testRun.options,
      parent ? parent.options : undefined,
      options
    );
    this.tests = [];
    this.suites = [];
    this.hooks = {
      [Hook.beforeEach]: [],
      [Hook.afterEach]: [],
      [Hook.beforeAll]: [],
      [Hook.afterAll]: []
    };
  }

  addSuite(suiteName: string, suiteOptions: SuiteOptions) {
    const newSuite = new TestSuite(this.testRun, this, [...this.name, suiteName], suiteOptions);
    this.suites.push(newSuite);
    return newSuite;
  }

  addTest(testName: string, testFunc: TestFunc, testOptions: TestOptions) {
    this.tests.push(new Test(this.testRun, this, [...this.name, testName], testFunc, testOptions));
  }

  addHook(hook: Hook, func: TestFunc) {
    this.hooks[hook].push(func);
  }

  countTests(): number {
    let count = this.tests.length;
    for (let i = 0, suiteCount = this.suites.length; i < suiteCount; i++) {
      count += this.suites[i].countTests();
    }
    return count;
  }

  async executeHook(hook: Hook) {
    const hooks = this.hooks[hook];
    for (let i = 0, count = hooks.length; i < count; i++) {
      await hooks[i]();
    }
  }

  async execute() {
    this.testRun.reportSuiteStarted({
      suiteName: this.name
    });

    const startTime = Date.now();

    await this.executeHook(Hook.beforeAll);

    for (let i = 0, count = this.tests.length; i < count; i++) {
      await this.executeHook(Hook.beforeEach);
      await this.tests[i].execute();
      await this.executeHook(Hook.afterEach);
    }

    for (let i = 0, count = this.suites.length; i < count; i++) {
      await this.executeHook(Hook.beforeEach);
      await this.suites[i].execute();
      await this.executeHook(Hook.afterEach);
    }

    await this.executeHook(Hook.afterAll);

    this.testRun.reportSuiteFinished({
      suiteName: this.name,
      time: Date.now() - startTime
    });
  }
}

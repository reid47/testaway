import Test from './Test';
import { TestFunc, Hook } from './types';
import TestRun from './TestRun';

export default class TestSuite {
  private testRun: TestRun;
  private name: string[];
  private parent: TestSuite | null;
  private tests: Test[];
  private suites: TestSuite[];
  private hooks: { [hook in Hook]: TestFunc[] };

  constructor(testRun: TestRun, parent?: TestSuite, name?: string) {
    this.testRun = testRun;
    this.parent = parent;
    this.name = this.parent ? [...this.parent.name, name] : this.name ? [name] : [];
    this.tests = [];
    this.suites = [];
    this.hooks = {
      [Hook.beforeEach]: [],
      [Hook.afterEach]: [],
      [Hook.beforeAll]: [],
      [Hook.afterAll]: []
    };
  }

  addSuite(suiteName: string) {
    const newSuite = new TestSuite(this.testRun, this, suiteName);
    this.suites.push(newSuite);
    return newSuite;
  }

  addTest(testName: string, testFunc: TestFunc) {
    this.tests.push(new Test(this.testRun, this, [...this.name, testName], testFunc));
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

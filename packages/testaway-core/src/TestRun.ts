import TestSuite from './TestSuite';
import {
  TestFunc,
  SuiteFunc,
  Hook,
  RunDefinedEvent,
  RunStartedEvent,
  RunFinishedEvent,
  SuiteStartedEvent,
  SuiteFinishedEvent,
  TestStartedEvent,
  TestFinishedEvent,
  TestOptions,
  SuiteOptions,
  TestRunOptions,
  Reporter,
  TestCategory
} from './types';
import { mergeTestRunOptionsWithDefaults } from './options';

export default class TestRun {
  options: TestRunOptions;
  root: TestSuite;
  currentSuite: TestSuite;
  testIds: { [id: string]: boolean };

  constructor(options?: TestRunOptions) {
    this.options = mergeTestRunOptionsWithDefaults(options);
    this.root = new TestSuite(this, null, [], TestCategory.default, undefined);
    this.currentSuite = this.root;
    this.testIds = Object.create(null);
  }

  addSuite(
    suiteName: string,
    defineSuite: SuiteFunc,
    suiteCategory: TestCategory,
    suiteOptions: SuiteOptions
  ) {
    const oldCurrentSuite = this.currentSuite;
    this.currentSuite = this.currentSuite.addSuite(suiteName, suiteCategory, suiteOptions);
    defineSuite();
    this.currentSuite = oldCurrentSuite;
  }

  addTest(
    testName: string,
    testFunc: TestFunc,
    testCategory: TestCategory,
    testOptions: TestOptions
  ) {
    this.currentSuite.addTest(testName, testFunc, testCategory, testOptions);
  }

  addHook(hook: Hook, func: TestFunc) {
    this.currentSuite.addHook(hook, func);
  }

  getTestId(testName: string[]) {
    let id = testName.join('>>');
    while (id in this.testIds) id += '_';
    this.testIds[id] = true;
    return id;
  }

  forEachReporter(func: (r: Reporter) => void) {
    if (!this.options.reporters) return;
    for (const reporter of this.options.reporters) func(reporter);
  }

  reportRunDefined(event: RunDefinedEvent) {
    this.forEachReporter(rep => rep.runDefined && rep.runDefined(event));
  }

  reportRunStarted(event: RunStartedEvent) {
    this.forEachReporter(rep => rep.runStarted && rep.runStarted(event));
  }

  reportRunFinished(event: RunFinishedEvent) {
    this.forEachReporter(rep => rep.runFinished && rep.runFinished(event));
  }

  reportSuiteStarted(event: SuiteStartedEvent) {
    this.forEachReporter(rep => rep.suiteStarted && rep.suiteStarted(event));
  }

  reportSuiteFinished(event: SuiteFinishedEvent) {
    this.forEachReporter(rep => rep.suiteFinished && rep.suiteFinished(event));
  }

  reportTestStarted(event: TestStartedEvent) {
    this.forEachReporter(rep => rep.testStarted && rep.testStarted(event));
  }

  reportTestFinished(event: TestFinishedEvent) {
    this.forEachReporter(rep => rep.testFinished && rep.testFinished(event));
  }

  analyze() {
    const root = this.root.analyze();
    this.reportRunDefined({ root });
    return root;
  }

  async execute() {
    this.reportRunStarted({ testCount: this.root.countTests() });
    const startTime = Date.now();
    await this.root.execute();
    this.reportRunFinished({ time: Date.now() - startTime });
  }
}

import TestSuite from './TestSuite';
import {
  TestFunc,
  SuiteFunc,
  Hook,
  RunStartedEvent,
  RunFinishedEvent,
  SuiteStartedEvent,
  SuiteFinishedEvent,
  TestStartedEvent,
  TestFinishedEvent,
  TestOptions,
  SuiteOptions,
  TestRunOptions,
  Reporter
} from './types';
import { mergeTestRunOptionsWithDefaults } from './options';

export default class TestRun {
  options: TestRunOptions;
  root: TestSuite;
  currentSuite: TestSuite;

  constructor(options?: TestRunOptions) {
    this.options = mergeTestRunOptionsWithDefaults(options);
    this.root = new TestSuite(this, null, [], undefined);
    this.currentSuite = this.root;
  }

  addSuite(suiteName: string, defineSuite: SuiteFunc, suiteOptions: SuiteOptions) {
    const oldCurrentSuite = this.currentSuite;
    this.currentSuite = this.currentSuite.addSuite(suiteName, suiteOptions);
    defineSuite();
    this.currentSuite = oldCurrentSuite;
  }

  addTest(testName: string, testFunc: TestFunc, testOptions: TestOptions) {
    this.currentSuite.addTest(testName, testFunc, testOptions);
  }

  addHook(hook: Hook, func: TestFunc) {
    this.currentSuite.addHook(hook, func);
  }

  forEachReporter(func: (r: Reporter) => void) {
    if (!this.options.reporters) return;
    for (const reporter of this.options.reporters) func(reporter);
  }

  reportRunStarted(event: RunStartedEvent) {
    this.forEachReporter(reporter => {
      reporter.runStarted && reporter.runStarted(event);
    });
  }

  reportRunFinished(event: RunFinishedEvent) {
    this.forEachReporter(reporter => {
      reporter.runFinished && reporter.runFinished(event);
    });
  }

  reportSuiteStarted(event: SuiteStartedEvent) {
    this.forEachReporter(reporter => {
      reporter.suiteStarted && reporter.suiteStarted(event);
    });
  }

  reportSuiteFinished(event: SuiteFinishedEvent) {
    this.forEachReporter(reporter => {
      reporter.suiteFinished && reporter.suiteFinished(event);
    });
  }

  reportTestStarted(event: TestStartedEvent) {
    this.forEachReporter(reporter => {
      reporter.testStarted && reporter.testStarted(event);
    });
  }

  reportTestFinished(event: TestFinishedEvent) {
    this.forEachReporter(reporter => {
      reporter.testFinished && reporter.testFinished(event);
    });
  }

  async execute() {
    this.reportRunStarted({
      testCount: this.root.countTests()
    });

    const startTime = Date.now();

    await this.root.execute();

    this.reportRunFinished({
      time: Date.now() - startTime
    });
  }
}

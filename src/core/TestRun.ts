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
  MergedOptions
} from './types';

export default class TestRun {
  private options: MergedOptions;
  private root: TestSuite;
  private currentSuite: TestSuite;

  constructor(options: MergedOptions) {
    this.options = options;
    this.root = new TestSuite(this, null);
    this.currentSuite = this.root;
  }

  addSuite(suiteName: string, defineSuite: SuiteFunc) {
    const oldCurrentSuite = this.currentSuite;
    this.currentSuite = this.currentSuite.addSuite(suiteName);
    defineSuite();
    this.currentSuite = oldCurrentSuite;
  }

  addTest(testName: string, testFunc: TestFunc) {
    this.currentSuite.addTest(testName, testFunc);
  }

  addHook(hook: Hook, func: TestFunc) {
    this.currentSuite.addHook(hook, func);
  }

  reportRunStarted(event: RunStartedEvent) {
    for (const reporter of this.options.reporters) {
      reporter.runStarted && reporter.runStarted(event);
    }
  }

  reportRunFinished(event: RunFinishedEvent) {
    for (const reporter of this.options.reporters) {
      reporter.runFinished && reporter.runFinished(event);
    }
  }

  reportSuiteStarted(event: SuiteStartedEvent) {
    for (const reporter of this.options.reporters) {
      reporter.suiteStarted && reporter.suiteStarted(event);
    }
  }

  reportSuiteFinished(event: SuiteFinishedEvent) {
    for (const reporter of this.options.reporters) {
      reporter.suiteFinished && reporter.suiteFinished(event);
    }
  }

  reportTestStarted(event: TestStartedEvent) {
    for (const reporter of this.options.reporters) {
      reporter.testStarted && reporter.testStarted(event);
    }
  }

  reportTestFinished(event: TestFinishedEvent) {
    for (const reporter of this.options.reporters) {
      reporter.testFinished && reporter.testFinished(event);
    }
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

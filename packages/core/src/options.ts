import { TestRunOptions, TestOptions, SuiteOptions } from './types';
import SimpleReporter from './SimpleReporter';

const defaultTestRunOptions: TestRunOptions = {
  reporters: [new SimpleReporter()],
  timeout: 5000
};

const defaultSuiteOptions: SuiteOptions = {
  timeout: 5000
};

const defaultTestOptions: TestOptions = {
  timeout: 5000
};

export const mergeTestRunOptionsWithDefaults = (given?: TestRunOptions): TestRunOptions => {
  if (!given) return defaultTestRunOptions;

  return {
    ...defaultTestRunOptions,
    ...given
  };
};

export const mergeSuiteOptionsWithDefaults = (
  testRunOptions: TestRunOptions = {},
  parentSuiteOptions: SuiteOptions = {},
  given: SuiteOptions = {}
): SuiteOptions => {
  const inheritedTestRunOptions = {
    ...('timeout' in testRunOptions ? { timeout: testRunOptions.timeout } : {})
  };

  return {
    ...defaultSuiteOptions,
    ...inheritedTestRunOptions,
    ...parentSuiteOptions,
    ...given
  };
};

export const mergeTestOptionsWithDefaults = (
  testRunOptions: TestRunOptions = {},
  parentSuiteOptions: SuiteOptions = {},
  given: TestOptions = {}
): TestOptions => {
  const inheritedTestRunOptions = {
    ...('timeout' in testRunOptions ? { timeout: testRunOptions.timeout } : {})
  };

  return {
    ...defaultTestOptions,
    ...inheritedTestRunOptions,
    ...parentSuiteOptions,
    ...given
  };
};

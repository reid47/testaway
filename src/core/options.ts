import { TestRunOptions, TestOptions, SuiteOptions } from './types';

const defaultTestRunOptions: TestRunOptions = {
  reporters: [],
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
  testRunOptions: TestRunOptions,
  parentSuiteOptions?: SuiteOptions,
  given?: SuiteOptions
): SuiteOptions => {
  if (!given) return defaultSuiteOptions;

  return {
    ...defaultSuiteOptions,
    ...given
  };
};

export const mergeTestOptionsWithDefaults = (
  testRunOptions: TestRunOptions,
  parentSuiteOptions: SuiteOptions,
  given?: TestOptions
): TestOptions => {
  if (!given) return defaultTestOptions;

  return {
    ...defaultTestOptions,
    ...given
  };
};

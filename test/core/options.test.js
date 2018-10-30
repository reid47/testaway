const SimpleReporter = require('../../dist/reporters/SimpleReporter').default;
const createTestRun = require('../../dist/core').default;
const {
  mergeTestRunOptionsWithDefaults,
  mergeSuiteOptionsWithDefaults,
  mergeTestOptionsWithDefaults
} = require('../../dist/core/options');
const assert = require('assert');

const { describe, it, execute } = createTestRun({
  reporters: [new SimpleReporter()]
});

describe('test run options', () => {
  it('works without options given', () => {
    const opts = mergeTestRunOptionsWithDefaults();
    assert.deepEqual(opts.reporters, []);
    assert.deepEqual(opts.timeout, 5000);
  });

  it('works with empty options given', () => {
    const opts = mergeTestRunOptionsWithDefaults({});
    assert.deepEqual(opts.reporters, []);
    assert.deepEqual(opts.timeout, 5000);
  });

  it('works with timeout given', () => {
    const opts = mergeTestRunOptionsWithDefaults({
      timeout: 1000
    });

    assert.deepEqual(opts.reporters, []);
    assert.deepEqual(opts.timeout, 1000);
  });

  it('works with reporters given', () => {
    const opts = mergeTestRunOptionsWithDefaults({
      reporters: ['test']
    });

    assert.deepEqual(opts.reporters, ['test']);
    assert.deepEqual(opts.timeout, 5000);
  });
});

describe('suite options', () => {
  it('works without options given', () => {
    const opts = mergeSuiteOptionsWithDefaults();
    assert.deepEqual(opts.timeout, 5000);
  });

  it('works with only test run options given', () => {
    const testRunOpts = { timeout: 1234 };
    const opts = mergeSuiteOptionsWithDefaults(testRunOpts);
    assert.deepEqual(opts.timeout, 1234);
  });

  it('works with test run options and parent suite options given', () => {
    const testRunOpts = { timeout: 1234 };
    const parentSuiteOpts = { timeout: 6789 };
    const opts = mergeSuiteOptionsWithDefaults(testRunOpts, parentSuiteOpts);
    assert.deepEqual(opts.timeout, 6789);
  });

  it('works with test run options, parent suite options, and suite options given', () => {
    const testRunOpts = { timeout: 1234 };
    const parentSuiteOpts = { timeout: 6789 };
    const suiteOpts = { timeout: 5555 };
    const opts = mergeSuiteOptionsWithDefaults(testRunOpts, parentSuiteOpts, suiteOpts);
    assert.deepEqual(opts.timeout, 5555);
  });
});

describe('test options', () => {
  it('works without options given', () => {
    const opts = mergeTestOptionsWithDefaults();
    assert.deepEqual(opts.timeout, 5000);
  });

  it('works with only test run options given', () => {
    const testRunOpts = { timeout: 1234 };
    const opts = mergeTestOptionsWithDefaults(testRunOpts);
    assert.deepEqual(opts.timeout, 1234);
  });

  it('works with test run options and parent suite options given', () => {
    const testRunOpts = { timeout: 1234 };
    const parentSuiteOpts = { timeout: 6789 };
    const opts = mergeTestOptionsWithDefaults(testRunOpts, parentSuiteOpts);
    assert.deepEqual(opts.timeout, 6789);
  });

  it('works with test run options, parent suite options, and suite options given', () => {
    const testRunOpts = { timeout: 1234 };
    const parentSuiteOpts = { timeout: 6789 };
    const suiteOpts = { timeout: 5555 };
    const opts = mergeTestOptionsWithDefaults(testRunOpts, parentSuiteOpts, suiteOpts);
    assert.deepEqual(opts.timeout, 5555);
  });
});

execute();

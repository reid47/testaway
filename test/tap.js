const createTestRun = require('../dist/core').default;
const TapReporter = require('../dist/reporters/TapReporter').default;
const expect = require('../dist/expect').default;

const { describe, it, execute } = createTestRun({
  reporters: [new TapReporter()]
});

it('test outside', () => {
  expect(47).toBe(47);
});

describe('reporting', () => {
  it('test one', () => {
    expect(47).toBe(47);
  });

  it('test two', () => {
    expect(47).toBe(7);
  });

  for (let i = 0; i < 0; i++) {
    it('runs ' + i, () => {
      expect(i).toBe(i);
    });
  }
});

execute();

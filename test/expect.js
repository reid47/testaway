const SimpleReporter = require('../dist/reporters/SimpleReporter').default;
const createTestRun = require('../dist/core').default;
const expect = require('../dist/expect').default;

const { describe, it, execute } = createTestRun({
  reporters: [new SimpleReporter()]
});

describe('toBe', () => {
  it('passes when it should', () => {
    expect(47).toBe(47);
    expect(47).not.toBe(48);
  });

  it('handles negative/positive 0 correctly', () => {
    expect(-0).not.toBe(0);
    expect(-0).not.toBe(+0);
    expect(-0).not.toBe(+0);

    expect(-0).toBe(-0);
    expect(+0).toBe(+0);
    expect(0).toBe(0);
  });

  it('fails when it should', () => {
    try {
      expect(47).toBe(48);
    } catch (err) {
      expect(err).toBeTruthy();
    }

    try {
      expect(47).not.toBe(47);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});

execute();

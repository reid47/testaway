const SimpleReporter = require('../../dist/reporters/SimpleReporter').default;
const createTestRun = require('../../dist/core').default;
const assert = require('assert');
const typeOf = require('../../dist/utils/type-of').default;

const { describe, it, execute } = createTestRun({
  reporters: [new SimpleReporter()]
});

describe('typeOf', () => {
  it('works on null', () => {
    assert.strictEqual(typeOf(null), 0);
  });

  it('works on undefined', () => {
    assert.strictEqual(typeOf(undefined), 1);
  });

  it('works on booleans', () => {
    assert.strictEqual(typeOf(true), 2);
    assert.strictEqual(typeOf(false), 2);
  });

  it('works on numbers', () => {
    assert.strictEqual(typeOf(47), 3);
    assert.strictEqual(typeOf(0), 3);
    assert.strictEqual(typeOf(-0), 3);
    assert.strictEqual(typeOf(Infinity), 3);
    assert.strictEqual(typeOf(-Infinity), 3);
    assert.strictEqual(typeOf(NaN), 3);
  });

  it('works on strings', () => {
    assert.strictEqual(typeOf(''), 4);
    assert.strictEqual(typeOf('hi'), 4);
  });

  it('works on functions', () => {
    assert.strictEqual(typeOf(() => null), 5);
    assert.strictEqual(typeOf(function() {}), 5);
    assert.strictEqual(typeOf(function wow() {}), 5);
  });

  it('works on regexps', () => {
    assert.strictEqual(typeOf(/aa/), 6);
    assert.strictEqual(typeOf(new RegExp('lol')), 6);
  });

  it('works on dates', () => {
    assert.strictEqual(typeOf(new Date()), 7);
  });

  it('works on arrays', () => {
    assert.strictEqual(typeOf([]), 8);
    assert.strictEqual(typeOf(['nice']), 8);
  });

  it('works on objects', () => {
    assert.strictEqual(typeOf({}), 9);
    assert.strictEqual(typeOf({ a: 1 }), 9);
  });
});

execute();

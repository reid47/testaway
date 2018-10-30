const SimpleReporter = require('../../dist/reporters/SimpleReporter').default;
const createTestRun = require('../../dist/core').default;
const assert = require('assert');
const mock = require('../../dist/mock').default;

const { describe, it, execute } = createTestRun({
  reporters: [new SimpleReporter()]
});

describe('mock', () => {
  it('creates a function', () => {
    const fn = mock.create();
    assert(typeof fn === 'function');
    assert.strictEqual(fn.name.toString(), 'MockFunction');
  });

  it('can be named', () => {
    const fn = mock.create();
    assert.strictEqual(fn.mock.name, '');

    fn.mock.named('a mock');
    assert.strictEqual(fn.mock.name, 'a mock');
  });

  it('tracks call counts', () => {
    const fn = mock.create();
    assert.strictEqual(fn.mock.callCount, 0);

    fn('wow!');
    assert.strictEqual(fn.mock.callCount, 1);

    fn.mock.resetCalls();
    assert.strictEqual(fn.mock.callCount, 0);
  });

  it('tracks call arguments', () => {
    const fn = mock.create();

    assert(typeof fn === 'function');
    assert.deepStrictEqual(fn.mock.calls, []);

    fn('wow!');
    assert.deepStrictEqual(fn.mock.calls, [['wow!']]);

    fn.mock.resetCalls();
    assert.deepStrictEqual(fn.mock.calls, []);

    fn(1, 2, 3);
    fn('hooray!');
    assert.deepStrictEqual(fn.mock.calls, [[1, 2, 3], ['hooray!']]);
  });

  it('can be given a return value', () => {
    const fn = mock.create();
    assert.strictEqual(fn(), undefined);

    fn.mock.returns(47);
    assert.strictEqual(fn(), 47);

    fn.mock.returns('hello!');
    assert.strictEqual(fn(), 'hello!');
  });

  it('can be given multiple numbered return values', () => {
    const fn = mock.create();

    fn.mock
      .onCall(0)
      .returns('first')
      .onCall(1)
      .returns('second')
      .returns('all others');

    assert.strictEqual(fn(), 'first');
    assert.strictEqual(fn(), 'second');
    assert.strictEqual(fn(), 'all others');
    assert.strictEqual(fn(), 'all others');

    const fn2 = mock.create();

    fn2.mock.onCall(0).returns('first');

    assert.strictEqual(fn2(), 'first');
    assert.strictEqual(fn2(), undefined);
    assert.strictEqual(fn2(), undefined);
  });
});

execute();

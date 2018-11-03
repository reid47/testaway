const test = require('tape');
const { ExpectationError } = require('../../dist/core/ExpectationError');

test('ExpectationError', t => {
  const matcher = function toTest() {};
  const err = new ExpectationError(matcher, false, 47, [], '');
  t.ok(err instanceof Error);
  t.end();
});

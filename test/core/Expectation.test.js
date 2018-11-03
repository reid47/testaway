const test = require('tape');
const { Expectation } = require('../../dist/core/Expectation');

const expect = value => new Expectation(value);

test('toBe', t => {
  expect(4).toBe(4);
  expect(4).not.toBe(10);
  // expect(4).not.toBe(4);
  t.end();
});

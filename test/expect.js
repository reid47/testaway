const createTestRun = require('../dist/core').default;
const expect = require('../dist/expect').default;
const { describe, it, execute } = createTestRun();

describe('toBe', () => {
  it('passes when it should', () => {
    expect(47).toBe(47);
    expect(47).not.toBe(48);
  });
});

// it('toThrow', () => {
//   expect(() => {
//     throw 'yep';
//   }).toThrow();

//   expect(() => {
//     return 'yep';
//   }).not.toThrow();
// });

execute();

const { test, expect, execute } = require('../dist').default();

test('expect.extend', () => {
  expect(() => expect(47).toBe47()).toThrow('toBe47 is not a function');

  expect().extend(proto => {
    proto.toBe47 = function() {
      const pass = this.actual === 47;
      this.assert(pass, 'toBe47', 'to be 47', [], []);
    };
  });

  expect(() => expect(47).toBe47()).not.toThrow('toBe47 is not a function');
  expect(47).toBe47();
  expect(48).not.toBe47();
});

execute();

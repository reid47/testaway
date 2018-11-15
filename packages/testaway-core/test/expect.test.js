const { expectErrorMessage } = require('./test-helpers');

test('expect toBe', () => {
  expect(47).toBe(47);
  expect('hello, world').toBe('hello, world');
  expect(true).toBe(true);
  const obj = { a: 1 };
  expect(obj).toBe(obj);

  expectErrorMessage(
    () => expect(47).toBe(48),
    'Expectation failed: expect(received).toBe(expected)',
    '',
    'Expected:',
    '  47',
    'to be:',
    '  48',
    ''
  );

  expectErrorMessage(
    () => expect(47).toBe('47'),
    'Expectation failed: expect(received).toBe(expected)',
    '',
    'Expected:',
    '  47',
    'to be:',
    '  "47"',
    ''
  );

  expectErrorMessage(
    () => expect({ a: 1 }).toBe({ a: 1 }),
    'Expectation failed: expect(received).toBe(expected)',
    '',
    'Expected:',
    '  Object { a: 1 }',
    'to be:',
    '  Object { a: 1 }',
    '',
    'Checked for reference equality because both values are objects. To check for structural equality, use toEqual.',
    ''
  );
});

test('expect not toBe', () => {
  expect(47).not.toBe(48);
  expect('hello, world').not.toBe('hello');
  expect(true).not.toBe(false);
  expect({ a: 1 }).not.toBe({ a: 1 });
  expect('hi').not.toBe(1);

  expectErrorMessage(
    () => expect(47).not.toBe(47),
    'Expectation failed: expect(received).not.toBe(expected)',
    '',
    'Expected:',
    '  47',
    'not to be:',
    '  47',
    ''
  );
});

test('expect toBeArray', () => {
  expect([]).toBeArray();
  expect([1, 2, 3]).toBeArray();

  expectErrorMessage(
    () => expect(47).toBeArray(),
    'Expectation failed: expect(received).toBeArray()',
    '',
    'Expected:',
    '  47',
    'to be an array.',
    ''
  );
});

test('expect not toBeArray', () => {
  expect(47).not.toBeArray();
  expect('hi').not.toBeArray();

  expectErrorMessage(
    () => expect([1, 2, 3]).not.toBeArray(),
    'Expectation failed: expect(received).not.toBeArray()',
    '',
    'Expected:',
    '  Array [1, 2, 3]',
    'not to be an array.',
    ''
  );
});

test('expect toBeCloseTo', () => {
  expect(47).toBeCloseTo(47);
  expect(47.0).toBeCloseTo(47.0001);

  expectErrorMessage(
    () => expect(47.01).toBeCloseTo(47.02),
    'Expectation failed: expect(received).toBeCloseTo(value)',
    '',
    'Expected:',
    '  47.01',
    'to be close to (precision: 2 decimal points):',
    '  47.02',
    ''
  );

  expectErrorMessage(
    () => expect(47).toBeCloseTo(47.001, 5),
    'Expectation failed: expect(received).toBeCloseTo(value)',
    '',
    'Expected:',
    '  47',
    'to be close to (precision: 5 decimal points):',
    '  47.001',
    ''
  );
});

test('expect not toBeCloseTo', () => {
  expect(47).not.toBeCloseTo(48);
  expect(47.1).not.toBeCloseTo(47.2);

  expectErrorMessage(
    () => expect(47.1).not.toBeCloseTo(47.1, 1),
    'Expectation failed: expect(received).not.toBeCloseTo(value)',
    '',
    'Expected:',
    '  47.1',
    'not to be close to (precision: 1 decimal points):',
    '  47.1',
    ''
  );

  expectErrorMessage(
    () => expect(47).not.toBeCloseTo(47.001),
    'Expectation failed: expect(received).not.toBeCloseTo(value)',
    '',
    'Expected:',
    '  47',
    'not to be close to (precision: 2 decimal points):',
    '  47.001',
    ''
  );
});

test('expect toBeDefined', () => {
  expect(47).toBeDefined();
  expect('hi').toBeDefined();

  expectErrorMessage(
    () => expect(undefined).toBeDefined(),
    'Expectation failed: expect(received).toBeDefined()',
    '',
    'Expected:',
    '  undefined',
    'to be defined.',
    ''
  );
});

test('expect not toBeDefined', () => {
  expect(undefined).not.toBeDefined();
  expect(void 0).not.toBeDefined();

  expectErrorMessage(
    () => expect(true).not.toBeDefined(),
    'Expectation failed: expect(received).not.toBeDefined()',
    '',
    'Expected:',
    '  true',
    'not to be defined.',
    ''
  );
});

test('expect toBeFalsy', () => {
  expect(undefined).toBeFalsy();
  expect(void 0).toBeFalsy();
  expect(false).toBeFalsy();
  expect(0).toBeFalsy();
  expect('').toBeFalsy();
  expect(NaN).toBeFalsy();

  expectErrorMessage(
    () => expect(true).toBeFalsy(),
    'Expectation failed: expect(received).toBeFalsy()',
    '',
    'Expected:',
    '  true',
    'to be falsy.',
    ''
  );
});

test('expect not toBeFalsy', () => {
  expect(47).not.toBeFalsy();
  expect('hi').not.toBeFalsy();
  expect([]).not.toBeFalsy();

  expectErrorMessage(
    () => expect(undefined).not.toBeFalsy(),
    'Expectation failed: expect(received).not.toBeFalsy()',
    '',
    'Expected:',
    '  undefined',
    'not to be falsy.',
    ''
  );

  expectErrorMessage(
    () => expect([]).toBeFalsy(),
    'Expectation failed: expect(received).toBeFalsy()',
    '',
    'Expected:',
    '  Array []',
    'to be falsy.',
    ''
  );

  expectErrorMessage(
    () => expect({}).toBeFalsy(),
    'Expectation failed: expect(received).toBeFalsy()',
    '',
    'Expected:',
    '  Object {}',
    'to be falsy.',
    ''
  );
});

test('expect toBeEmpty', () => {
  expect([]).toBeEmpty();
  expect('').toBeEmpty();
  expect({}).toBeEmpty();
  expect(new Map()).toBeEmpty();
  expect(new Set()).toBeEmpty();

  expectErrorMessage(
    () => expect('nope').toBeEmpty(),
    'Expectation failed: expect(received).toBeEmpty()',
    '',
    'Expected:',
    '  "nope"',
    'to be empty.',
    ''
  );

  expectErrorMessage(
    () => expect([1, 2, 3]).toBeEmpty(),
    'Expectation failed: expect(received).toBeEmpty()',
    '',
    'Expected:',
    '  Array [1, 2, 3]',
    'to be empty.',
    ''
  );

  expectErrorMessage(
    () => expect({ a: 1 }).toBeEmpty(),
    'Expectation failed: expect(received).toBeEmpty()',
    '',
    'Expected:',
    '  Object { a: 1 }',
    'to be empty.',
    ''
  );

  expectErrorMessage(
    () => expect(47).toBeEmpty(),
    'Expectation failed: expect(received).toBeEmpty()',
    '',
    'Expected:',
    '  47',
    'to be empty.',
    ''
  );
});

test('expect not toBeEmpty', () => {
  expect([1, 2, 3]).not.toBeEmpty();
  expect('hi').not.toBeEmpty();
  expect({ a: 1 }).not.toBeEmpty();
  expect(new Map([['a', 1]])).not.toBeEmpty();
  expect(new Set([1, 2, 3])).not.toBeEmpty();

  expectErrorMessage(
    () => expect([]).not.toBeEmpty(),
    'Expectation failed: expect(received).not.toBeEmpty()',
    '',
    'Expected:',
    '  Array []',
    'not to be empty.',
    ''
  );
});

test('expect toBeInstanceOf', () => {
  class Wow {}
  expect(new Wow()).toBeInstanceOf(Wow);

  expectErrorMessage(
    () => expect(false).toBeInstanceOf(Wow),
    'Expectation failed: expect(received).toBeInstanceOf(expected)',
    '',
    'Expected:',
    '  false',
    'to be an instance of:',
    '  [Function: Wow]',
    ''
  );
});

test('expect not toBeInstanceOf', () => {
  class Wow {}
  expect(false).not.toBeInstanceOf(Wow);

  expectErrorMessage(
    () => expect(new Wow()).not.toBeInstanceOf(Wow),
    'Expectation failed: expect(received).not.toBeInstanceOf(expected)',
    '',
    'Expected:',
    '  Wow {}',
    'not to be an instance of:',
    '  [Function: Wow]',
    ''
  );
});

test('expect toBeNull', () => {
  expect(null).toBeNull();

  expectErrorMessage(
    () => expect(true).toBeNull(),
    'Expectation failed: expect(received).toBeNull()',
    '',
    'Expected:',
    '  true',
    'to be null.',
    ''
  );
});

test('expect not toBeNull', () => {
  expect(47).not.toBeNull();
  expect('hi').not.toBeNull();

  expectErrorMessage(
    () => expect(null).not.toBeNull(),
    'Expectation failed: expect(received).not.toBeNull()',
    '',
    'Expected:',
    '  null',
    'not to be null.',
    ''
  );
});

test('expect toBeTruthy', () => {
  expect(true).toBeTruthy();
  expect(2).toBeTruthy();
  expect('nice').toBeTruthy();
  expect({}).toBeTruthy();

  expectErrorMessage(
    () => expect(false).toBeTruthy(),
    'Expectation failed: expect(received).toBeTruthy()',
    '',
    'Expected:',
    '  false',
    'to be truthy.',
    ''
  );
});

test('expect not toBeTruthy', () => {
  expect(false).not.toBeTruthy();
  expect('').not.toBeTruthy();

  expectErrorMessage(
    () => expect('yep').not.toBeTruthy(),
    'Expectation failed: expect(received).not.toBeTruthy()',
    '',
    'Expected:',
    '  "yep"',
    'not to be truthy.',
    ''
  );
});

test('expect toBeUndefined', () => {
  expect(undefined).toBeUndefined();
  expect(void 0).toBeUndefined();

  expectErrorMessage(
    () => expect(true).toBeUndefined(),
    'Expectation failed: expect(received).toBeUndefined()',
    '',
    'Expected:',
    '  true',
    'to be undefined.',
    ''
  );
});

test('expect not toBeUndefined', () => {
  expect(47).not.toBeUndefined();
  expect('hi').not.toBeUndefined();

  expectErrorMessage(
    () => expect(undefined).not.toBeUndefined(),
    'Expectation failed: expect(received).not.toBeUndefined()',
    '',
    'Expected:',
    '  undefined',
    'not to be undefined.',
    ''
  );
});

test('expect toContain', () => {
  expect([1, 2, 3]).toContain(3);
  expect(['hello', 'world']).toContain('hello');
  expect('hello').toContain('ell');
  expect([{ a: 1 }, { b: 2 }, { c: 3 }]).toContain({ b: 2 });

  expectErrorMessage(
    () => expect([1, 2, 3]).toContain(4),
    'Expectation failed: expect(received).toContain(expected)',
    '',
    'Expected:',
    '  Array [1, 2, 3]',
    'to contain element:',
    '  4',
    ''
  );

  expectErrorMessage(
    () => expect('a string').toContain('something'),
    'Expectation failed: expect(received).toContain(expected)',
    '',
    'Expected:',
    '  "a string"',
    'to contain substring:',
    '  "something"',
    ''
  );
});

test('expect not toContain', () => {
  expect([1, 2, 3]).not.toContain(5);
  expect('hi').not.toContain('wow');

  expectErrorMessage(
    () => expect([1, 2]).not.toContain(2),
    'Expectation failed: expect(received).not.toContain(expected)',
    '',
    'Expected:',
    '  Array [1, 2]',
    'not to contain element:',
    '  2',
    ''
  );

  expectErrorMessage(
    () => expect('hello').not.toContain('ell'),
    'Expectation failed: expect(received).not.toContain(expected)',
    '',
    'Expected:',
    '  "hello"',
    'not to contain substring:',
    '  "ell"',
    ''
  );
});

test('expect toEqual', () => {
  expect(47).toEqual(47);
  expect('hello, world').toEqual('hello, world');
  expect(true).toEqual(true);
  expect({ a: 1 }).toEqual({ a: 1 });

  expectErrorMessage(
    () => expect(47).toEqual(48),
    'Expectation failed: expect(received).toEqual(expected)',
    '',
    'Expected:',
    '  47',
    'to equal:',
    '  48',
    'but values are different.',
    ''
  );

  expectErrorMessage(
    () => expect(47).toEqual('47'),
    'Expectation failed: expect(received).toEqual(expected)',
    '',
    'Expected:',
    '  47',
    'to equal:',
    '  "47"',
    'but types are different (received a number, but expected a string).',
    ''
  );

  expectErrorMessage(
    () => expect({ a: 1 }).toEqual({ a: 1, c: 5 }),
    'Expectation failed: expect(received).toEqual(expected)',
    '',
    'Expected:',
    '  Object { a: 1 }',
    'to equal:',
    '  Object { a: 1, c: 5 }',
    'but objects are different:',
    '  - missing expected key "c"',
    ''
  );

  expectErrorMessage(
    () => expect({ a: 1, b: 3 }).toEqual({ a: 2, c: 5 }),
    'Expectation failed: expect(received).toEqual(expected)',
    '',
    'Expected:',
    '  Object { a: 1, b: 3 }',
    'to equal:',
    '  Object { a: 2, c: 5 }',
    'but objects are different:',
    '  - at key "a": received 1, but expected 2',
    '  - missing expected key "c"',
    '  - unexpected key "b"',
    ''
  );
});

test('expect not toEqual', () => {
  expect(47).not.toEqual(48);
  expect('hello, world').not.toEqual('hello');
  expect(true).not.toEqual(false);
  expect({ a: 1 }).not.toEqual({ a: 2 });
  expect('hi').not.toEqual(1);

  expectErrorMessage(
    () => expect(47).not.toEqual(47),
    'Expectation failed: expect(received).not.toEqual(expected)',
    '',
    'Expected:',
    '  47',
    'not to equal:',
    '  47',
    ''
  );

  expectErrorMessage(
    () => expect({ a: 1 }).not.toEqual({ a: 1 }),
    'Expectation failed: expect(received).not.toEqual(expected)',
    '',
    'Expected:',
    '  Object { a: 1 }',
    'not to equal:',
    '  Object { a: 1 }',
    ''
  );
});

test('expect toHaveLength', () => {
  expect([]).toHaveLength(0);
  expect([1, 2]).toHaveLength(2);
  expect('hello').toHaveLength(5);
  expect({ length: 47 }).toHaveLength(47);

  expectErrorMessage(
    () => expect([]).toHaveLength(99),
    'Expectation failed: expect(received).toHaveLength(expected)',
    '',
    'Expected:',
    '  Array []',
    'to have length:',
    '  99',
    'but actual length was:',
    '  0',
    ''
  );

  expectErrorMessage(
    () => expect({}).toHaveLength(100),
    'Expectation failed: expect(received).toHaveLength(expected)',
    '',
    'Expected:',
    '  Object {}',
    'to have length:',
    '  100',
    'but actual length was:',
    '  undefined',
    ''
  );
});

test('expect not toHaveLength', () => {
  expect([]).not.toHaveLength(9);
  expect('hi').not.toHaveLength(5);

  expectErrorMessage(
    () => expect([1, 1, 1]).not.toHaveLength(3),
    'Expectation failed: expect(received).not.toHaveLength(expected)',
    '',
    'Expected:',
    '  Array [1, 1, 1]',
    'not to have length:',
    '  3',
    ''
  );
});

test('expect toHaveProperty', () => {
  expect({ hello: 'world' }).toHaveProperty('hello');
  expect({ hello: 'world' }).toHaveProperty('hello', 'world');

  expectErrorMessage(
    () => expect({}).toHaveProperty('hello'),
    'Expectation failed: expect(received).toHaveProperty(property)',
    '',
    'Expected:',
    '  Object {}',
    'to have property:',
    '  "hello"',
    ''
  );

  expectErrorMessage(
    () => expect({ hello: 'world' }).toHaveProperty('hello', 'other'),
    'Expectation failed: expect(received).toHaveProperty(property, value)',
    '',
    'Expected:',
    '  Object { hello: "world" }',
    'to have property:',
    '  "hello"',
    'with value:',
    '  "other"',
    'but actual value for "hello" was:',
    '  "world"',
    ''
  );
});

test('expect not toHaveProperty', () => {
  expect({}).not.toHaveProperty('hello');
  expect({ hello: 'world' }).not.toHaveProperty('hello', 'other');

  expectErrorMessage(
    () => expect({ hello: 'world' }).not.toHaveProperty('hello'),
    'Expectation failed: expect(received).not.toHaveProperty(property)',
    '',
    'Expected:',
    '  Object { hello: "world" }',
    'not to have property:',
    '  "hello"',
    ''
  );

  expectErrorMessage(
    () => expect({ hello: 'world' }).not.toHaveProperty('hello', 'world'),
    'Expectation failed: expect(received).not.toHaveProperty(property, value)',
    '',
    'Expected:',
    '  Object { hello: "world" }',
    'not to have property:',
    '  "hello"',
    'with value:',
    '  "world"',
    'but actual value for "hello" was:',
    '  "world"',
    ''
  );
});

test('expect toHaveType', () => {
  expect(undefined).toHaveType('undefined');
  expect(0).toHaveType('number');

  expectErrorMessage(
    () => expect(true).toHaveType('string'),
    'Expectation failed: expect(received).toHaveType(expected)',
    '',
    'Expected:',
    '  true',
    'to have type:',
    '  "string"',
    'but actual type was:',
    '  "boolean"',
    ''
  );
});

test('expect not toHaveType', () => {
  expect(47).not.toHaveType('string');
  expect('hi').not.toHaveType('boolean');

  expectErrorMessage(
    () => expect(undefined).not.toHaveType('undefined'),
    'Expectation failed: expect(received).not.toHaveType(expected)',
    '',
    'Expected:',
    '  undefined',
    'not to have type:',
    '  "undefined"',
    ''
  );
});

test('expect toBeGreaterThan', () => {
  expect(10).toBeGreaterThan(0);
  expect(-1).toBeGreaterThan(-100);

  expectErrorMessage(
    () => expect(10).toBeGreaterThan(100),
    'Expectation failed: expect(received).toBeGreaterThan(expected)',
    '',
    'Expected:',
    '  10',
    'to be greater than:',
    '  100',
    ''
  );
});

test('expect not toBeGreaterThan', () => {
  expect(10).not.toBeGreaterThan(11);
  expect(-1).not.toBeGreaterThan(0);

  expectErrorMessage(
    () => expect(10).not.toBeGreaterThan(9),
    'Expectation failed: expect(received).not.toBeGreaterThan(expected)',
    '',
    'Expected:',
    '  10',
    'not to be greater than:',
    '  9',
    ''
  );
});

test('expect toBeGreaterThanOrEqual', () => {
  expect(10).toBeGreaterThanOrEqual(0);
  expect(-1).toBeGreaterThanOrEqual(-100);
  expect(33).toBeGreaterThanOrEqual(33);

  expectErrorMessage(
    () => expect(10).toBeGreaterThanOrEqual(100),
    'Expectation failed: expect(received).toBeGreaterThanOrEqual(expected)',
    '',
    'Expected:',
    '  10',
    'to be greater than or equal:',
    '  100',
    ''
  );
});

test('expect not toBeGreaterThanOrEqual', () => {
  expect(10).not.toBeGreaterThanOrEqual(11);
  expect(-1).not.toBeGreaterThanOrEqual(0);

  expectErrorMessage(
    () => expect(10).not.toBeGreaterThanOrEqual(9),
    'Expectation failed: expect(received).not.toBeGreaterThanOrEqual(expected)',
    '',
    'Expected:',
    '  10',
    'not to be greater than or equal:',
    '  9',
    ''
  );
});

test('expect toBeLessThan', () => {
  expect(0).toBeLessThan(100);
  expect(-100).toBeLessThan(-1);

  expectErrorMessage(
    () => expect(10).toBeLessThan(1),
    'Expectation failed: expect(received).toBeLessThan(expected)',
    '',
    'Expected:',
    '  10',
    'to be less than:',
    '  1',
    ''
  );
});

test('expect not toBeLessThan', () => {
  expect(10).not.toBeLessThan(8);
  expect(-1).not.toBeLessThan(-100);

  expectErrorMessage(
    () => expect(10).not.toBeLessThan(11),
    'Expectation failed: expect(received).not.toBeLessThan(expected)',
    '',
    'Expected:',
    '  10',
    'not to be less than:',
    '  11',
    ''
  );
});

test('expect toBeLessThanOrEqual', () => {
  expect(0).toBeLessThanOrEqual(100);
  expect(-100).toBeLessThanOrEqual(-1);
  expect(33).toBeLessThanOrEqual(33);

  expectErrorMessage(
    () => expect(10).toBeLessThanOrEqual(1),
    'Expectation failed: expect(received).toBeLessThanOrEqual(expected)',
    '',
    'Expected:',
    '  10',
    'to be less than or equal:',
    '  1',
    ''
  );
});

test('expect not toBeLessThanOrEqual', () => {
  expect(10).not.toBeLessThanOrEqual(8);
  expect(-1).not.toBeLessThanOrEqual(-100);

  expectErrorMessage(
    () => expect(10).not.toBeLessThanOrEqual(90),
    'Expectation failed: expect(received).not.toBeLessThanOrEqual(expected)',
    '',
    'Expected:',
    '  10',
    'not to be less than or equal:',
    '  90',
    ''
  );
});

test('expect toMatch', () => {
  expect('hello world').toMatch('ello');
  expect('hello world').toMatch(/ello/);

  expectErrorMessage(
    () => expect('hello world').toMatch('wow'),
    'Expectation failed: expect(received).toMatch(string)',
    '',
    'Expected:',
    '  "hello world"',
    'to contain string:',
    '  "wow"',
    ''
  );

  expectErrorMessage(
    () => expect('hello world').toMatch(/wow/),
    'Expectation failed: expect(received).toMatch(regex)',
    '',
    'Expected:',
    '  "hello world"',
    'to match regular expression:',
    '  /wow/',
    ''
  );
});

test('expect not toMatch', () => {
  expect('hello world').not.toMatch('wow');
  expect('hello world').not.toMatch(/wow/);

  expectErrorMessage(
    () => expect('hello world').not.toMatch('ello'),
    'Expectation failed: expect(received).not.toMatch(string)',
    '',
    'Expected:',
    '  "hello world"',
    'not to contain string:',
    '  "ello"',
    ''
  );

  expectErrorMessage(
    () => expect('hello world').not.toMatch(/ello/),
    'Expectation failed: expect(received).not.toMatch(regex)',
    '',
    'Expected:',
    '  "hello world"',
    'not to match regular expression:',
    '  /ello/',
    ''
  );
});

test('expect toSatisfy', () => {
  expect('hello world').toSatisfy(s => s.length > 10);

  expectErrorMessage(
    () => expect('hello world').toSatisfy(s => s.length > 100),
    'Expectation failed: expect(received).toSatisfy(predicate)',
    '',
    'Expected:',
    '  "hello world"',
    'to satisfy predicate function.',
    ''
  );
});

test('expect not toSatisfy', () => {
  expect('hello world').not.toSatisfy(s => s.length > 100);

  expectErrorMessage(
    () => expect('hello world').not.toSatisfy(s => s.length > 10),
    'Expectation failed: expect(received).not.toSatisfy(predicate)',
    '',
    'Expected:',
    '  "hello world"',
    'not to satisfy predicate function.',
    ''
  );
});

test('expect toThrow', () => {
  expect(() => {
    throw new Error('failed');
  }).toThrow();
  expect(() => {
    throw new Error('failed');
  }).toThrow('failed');
  expect(() => {
    throw new Error('failed');
  }).toThrow('fail');
  expect(() => {
    throw new Error('failed');
  }).toThrow(/ail/);
  expect(() => {
    throw new TypeError('failed');
  }).toThrow(TypeError);

  expectErrorMessage(
    () => expect(() => {}).toThrow(),
    'Expectation failed: expect(received).toThrow()',
    '',
    'Expected:',
    '  [Function]',
    'to throw.',
    ''
  );

  expectErrorMessage(
    () =>
      expect(() => {
        throw new Error('failed');
      }).toThrow('bad'),
    'Expectation failed: expect(received).toThrow(string)',
    '',
    'Expected:',
    '  [Function]',
    'to throw an error containing string:',
    '  "bad"',
    ''
  );

  expectErrorMessage(
    () => expect(() => {}).toThrow('bad'),
    'Expectation failed: expect(received).toThrow(string)',
    '',
    'Expected:',
    '  [Function]',
    'to throw an error containing string:',
    '  "bad"',
    'but it did not throw.',
    ''
  );

  expectErrorMessage(
    () =>
      expect(() => {
        throw new Error('failed');
      }).toThrow(/bad/),
    'Expectation failed: expect(received).toThrow(regex)',
    '',
    'Expected:',
    '  [Function]',
    'to throw an error matching regular expression:',
    '  /bad/',
    ''
  );

  expectErrorMessage(
    () => expect(() => {}).toThrow(/bad/),
    'Expectation failed: expect(received).toThrow(regex)',
    '',
    'Expected:',
    '  [Function]',
    'to throw an error matching regular expression:',
    '  /bad/',
    'but it did not throw.',
    ''
  );

  expectErrorMessage(
    () =>
      expect(() => {
        throw new Error('failed');
      }).toThrow(TypeError),
    'Expectation failed: expect(received).toThrow(errorType)',
    '',
    'Expected:',
    '  [Function]',
    'to throw an instance of:',
    '  [Function: TypeError]',
    ''
  );

  expectErrorMessage(
    () => expect(() => {}).toThrow(TypeError),
    'Expectation failed: expect(received).toThrow(errorType)',
    '',
    'Expected:',
    '  [Function]',
    'to throw an instance of:',
    '  [Function: TypeError]',
    'but it did not throw.',
    ''
  );
});

test('expect not toThrow', () => {
  expect(() => {}).not.toThrow();
  expect(() => {
    throw new Error('failed');
  }).not.toThrow('other');
  expect(() => {
    throw new Error('failed');
  }).not.toThrow(/other/);
  expect(() => {
    throw new Error('failed');
  }).not.toThrow(TypeError);

  expectErrorMessage(
    () =>
      expect(() => {
        throw new Error('uh oh');
      }).not.toThrow(),
    'Expectation failed: expect(received).not.toThrow()',
    '',
    'Expected:',
    '  [Function]',
    'not to throw.',
    ''
  );

  expectErrorMessage(
    () =>
      expect(() => {
        throw new Error('failed');
      }).not.toThrow('fail'),
    'Expectation failed: expect(received).not.toThrow(string)',
    '',
    'Expected:',
    '  [Function]',
    'not to throw an error containing string:',
    '  "fail"',
    ''
  );

  expectErrorMessage(
    () =>
      expect(() => {
        throw new Error('failed');
      }).not.toThrow(/fail/),
    'Expectation failed: expect(received).not.toThrow(regex)',
    '',
    'Expected:',
    '  [Function]',
    'not to throw an error matching regular expression:',
    '  /fail/',
    ''
  );

  expectErrorMessage(
    () =>
      expect(() => {
        throw new TypeError('failed');
      }).not.toThrow(TypeError),
    'Expectation failed: expect(received).not.toThrow(errorType)',
    '',
    'Expected:',
    '  [Function]',
    'not to throw an instance of:',
    '  [Function: TypeError]',
    ''
  );
});

// const SimpleReporter = require('../../dist/reporters/SimpleReporter').default;
// const createTestRun = require('../../dist/core').default;
// const assert = require('assert');
// const objectDiff = require('../../dist/utils/object-diff').default;

// const { describe, it, execute } = createTestRun({
//   reporters: [new SimpleReporter()]
// });

// describe('objectDiff', () => {
//   it('equal nulls', () => {
//     assert.deepStrictEqual(objectDiff(null, null), []);
//   });

//   it('equal undefineds', () => {
//     assert.deepStrictEqual(objectDiff(undefined, undefined), []);
//     assert.deepStrictEqual(objectDiff(undefined, void 0), []);
//   });

//   it('equal numbers', () => {
//     assert.deepStrictEqual(objectDiff(1, 1), []);
//   });

//   it('equal strings', () => {
//     assert.deepStrictEqual(objectDiff('hi', 'hi'), []);
//   });

//   it('equal booleans', () => {
//     assert.deepStrictEqual(objectDiff(true, true), []);
//   });

//   it('equal regexps', () => {
//     assert.deepStrictEqual(objectDiff(/aa/, /aa/), []);
//     assert.deepStrictEqual(objectDiff(/aa/gi, /aa/gi), []);
//     const re1 = /a/gi;
//     const re2 = new RegExp('a', 'ig');
//     assert.deepStrictEqual(objectDiff(re1, re2), []);
//   });

//   it('equal dates', () => {
//     assert.deepStrictEqual(objectDiff(new Date('12/23/1993'), new Date('12/23/1993')), []);
//   });

//   it('equal functions', () => {
//     const func = () => 47;
//     assert.deepStrictEqual(objectDiff(func, func), []);
//   });

//   it('unequal numbers', () => {
//     assert.deepStrictEqual(objectDiff(1, 2), [
//       {
//         type: 'wrong-value',
//         keyPath: [],
//         expected: 1,
//         actual: 2
//       }
//     ]);
//   });

//   it('unequal strings', () => {
//     assert.deepStrictEqual(objectDiff('hi', 'wow'), [
//       {
//         type: 'wrong-value',
//         keyPath: [],
//         expected: 'hi',
//         actual: 'wow'
//       }
//     ]);
//   });

//   it('unequal booleans', () => {
//     assert.deepStrictEqual(objectDiff(true, false), [
//       {
//         type: 'wrong-value',
//         keyPath: [],
//         expected: true,
//         actual: false
//       }
//     ]);
//   });

//   it('unequal regexps', () => {
//     assert.deepStrictEqual(objectDiff(/aa/, /bb/), [
//       {
//         type: 'wrong-value',
//         keyPath: [],
//         expected: /aa/,
//         actual: /bb/
//       }
//     ]);
//   });

//   it('unequal dates', () => {
//     assert.deepEqual(objectDiff(new Date('12/23/1993'), new Date('12/23/1994')), [
//       {
//         type: 'wrong-value',
//         keyPath: [],
//         expected: new Date('12/23/1993'),
//         actual: new Date('12/23/1994')
//       }
//     ]);
//   });

//   it('unequal functions', () => {
//     const func1 = () => 47;
//     const func2 = () => 47;
//     assert.deepEqual(objectDiff(func1, func2), [
//       {
//         type: 'wrong-value',
//         keyPath: [],
//         expected: func1,
//         actual: func2
//       }
//     ]);
//   });

//   it('wrong types (number vs. regexp)', () => {
//     assert.deepStrictEqual(objectDiff(1, /bb/), [
//       {
//         type: 'wrong-type',
//         keyPath: [],
//         expected: 1,
//         actual: /bb/
//       }
//     ]);
//   });

//   it('wrong types (number vs. string)', () => {
//     assert.deepStrictEqual(objectDiff(1, 'hi'), [
//       {
//         type: 'wrong-type',
//         keyPath: [],
//         expected: 1,
//         actual: 'hi'
//       }
//     ]);
//   });

//   it('wrong types (number vs. object)', () => {
//     assert.deepStrictEqual(objectDiff(1, {}), [
//       {
//         type: 'wrong-type',
//         keyPath: [],
//         expected: 1,
//         actual: {}
//       }
//     ]);
//   });

//   it('wrong types (array vs. object)', () => {
//     assert.deepStrictEqual(objectDiff([], {}), [
//       {
//         type: 'wrong-type',
//         keyPath: [],
//         expected: [],
//         actual: {}
//       }
//     ]);
//   });

//   it('wrong types (function vs. object)', () => {
//     const func = () => null;
//     assert.deepStrictEqual(objectDiff(func, {}), [
//       {
//         type: 'wrong-type',
//         keyPath: [],
//         expected: func,
//         actual: {}
//       }
//     ]);
//   });

//   it('missing keys (top-level)', () => {
//     assert.deepStrictEqual(objectDiff({ a: 1, b: 2 }, { a: 1 }), [
//       {
//         type: 'missing-key',
//         keyPath: ['b'],
//         expected: 2,
//         actual: undefined
//       }
//     ]);

//     assert.deepStrictEqual(objectDiff({ a: 1, b: 2, c: 3 }, { a: 1 }), [
//       {
//         type: 'missing-key',
//         keyPath: ['b'],
//         expected: 2,
//         actual: undefined
//       },
//       {
//         type: 'missing-key',
//         keyPath: ['c'],
//         expected: 3,
//         actual: undefined
//       }
//     ]);
//   });

//   it('missing keys (nested)', () => {
//     assert.deepStrictEqual(objectDiff({ a: { b: 1, c: 2 } }, { a: { b: 1 } }), [
//       {
//         type: 'missing-key',
//         keyPath: ['a', 'c'],
//         expected: 2,
//         actual: undefined
//       }
//     ]);

//     assert.deepStrictEqual(objectDiff({ a: 1, b: { c: 2, d: 3 } }, { a: 1 }), [
//       {
//         type: 'missing-key',
//         keyPath: ['b'],
//         expected: { c: 2, d: 3 },
//         actual: undefined
//       }
//     ]);

//     assert.deepStrictEqual(
//       objectDiff(
//         {
//           a: 1,
//           b: { c: { d: 6, e: 7, f: 8 } }
//         },
//         {
//           a: 1,
//           b: { c: { f: 8 } }
//         }
//       ),
//       [
//         {
//           type: 'missing-key',
//           keyPath: ['b', 'c', 'd'],
//           expected: 6,
//           actual: undefined
//         },
//         {
//           type: 'missing-key',
//           keyPath: ['b', 'c', 'e'],
//           expected: 7,
//           actual: undefined
//         }
//       ]
//     );
//   });

//   it('extra keys (top-level)', () => {
//     assert.deepStrictEqual(objectDiff({ a: 1 }, { a: 1, b: 2, c: 3 }), [
//       {
//         type: 'extra-key',
//         keyPath: ['b'],
//         expected: undefined,
//         actual: 2
//       },
//       {
//         type: 'extra-key',
//         keyPath: ['c'],
//         expected: undefined,
//         actual: 3
//       }
//     ]);
//   });

//   it('extra keys (nested)', () => {
//     assert.deepStrictEqual(objectDiff({ a: { b: 1 } }, { a: { b: 1, c: 2 } }), [
//       {
//         type: 'extra-key',
//         keyPath: ['a', 'c'],
//         expected: undefined,
//         actual: 2
//       }
//     ]);

//     assert.deepStrictEqual(objectDiff({ a: 1 }, { a: 1, b: { c: 2, d: 3 } }), [
//       {
//         type: 'extra-key',
//         keyPath: ['b'],
//         expected: undefined,
//         actual: { c: 2, d: 3 }
//       }
//     ]);

//     assert.deepStrictEqual(
//       objectDiff(
//         {
//           a: 1,
//           b: { c: { f: 8 } }
//         },
//         {
//           a: 1,
//           b: { c: { d: 6, e: 7, f: 8 } }
//         }
//       ),
//       [
//         {
//           type: 'extra-key',
//           keyPath: ['b', 'c', 'd'],
//           expected: undefined,
//           actual: 6
//         },
//         {
//           type: 'extra-key',
//           keyPath: ['b', 'c', 'e'],
//           expected: undefined,
//           actual: 7
//         }
//       ]
//     );
//   });

//   it('wrong object values', () => {
//     assert.deepStrictEqual(objectDiff({ a: 1, b: 2, c: 4 }, { a: 1, b: 2, c: 3 }), [
//       {
//         type: 'wrong-value',
//         keyPath: ['c'],
//         expected: 4,
//         actual: 3
//       }
//     ]);

//     assert.deepStrictEqual(objectDiff({ a: 1, b: 4, c: 4 }, { a: 1, b: 2, c: 3 }), [
//       {
//         type: 'wrong-value',
//         keyPath: ['b'],
//         expected: 4,
//         actual: 2
//       },
//       {
//         type: 'wrong-value',
//         keyPath: ['c'],
//         expected: 4,
//         actual: 3
//       }
//     ]);

//     assert.deepStrictEqual(
//       objectDiff(
//         {
//           a: 1,
//           b: 4,
//           c: { d: true, e: { f: false } }
//         },
//         {
//           a: 1,
//           b: 2,
//           c: { d: true, e: { f: true } }
//         }
//       ),
//       [
//         {
//           type: 'wrong-value',
//           keyPath: ['b'],
//           expected: 4,
//           actual: 2
//         },
//         {
//           type: 'wrong-value',
//           keyPath: ['c', 'e', 'f'],
//           expected: false,
//           actual: true
//         }
//       ]
//     );
//   });
// });

// execute();

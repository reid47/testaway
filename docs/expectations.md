---
id: expectations
title: Expectations
---

`expect` is a helper for making assertions about values in your tests.

It lets you write your tests so that they read almost like complete sentences, and it throws helpful errors when expectations fail.

In the following test, we expect the return value of a function to be 47. We can translate that expectation into code almost directly using `expect`:

```js
it('returns the right number', () => {
  const returnValue = myFunction();
  expect(returnValue).toBe(47);
});
```

`expect` provides a bunch of built-in _matchers_ to let you make different kinds of assertions. Matchers are methods like `.toBe()`, `.toEqual()`, and `.toBeGreaterThan()`. A full list of included matchers is below.

`expect` also has _modifiers_, which are used with matchers to change how they work. For example, the `.not` modifier negates the expectation: while `expect(value).toBe(47)` expects a value to be 47, `expect(value).not.toBe(47)` expects a value _not_ to be 47. A full list of included modifiers is below.

## Matchers

### `toBe(expected: any)`

Expects the actual value to be `===` to the expected value.

Note that since `===` is used, this will check for _reference_ equality for objects, arrays, and functions. To check for deep equality on objects or arrays, use `toEqual`.

#### Passing examples

```js
expect(47).toBe(47);
expect('hello').toBe('hello');
const obj = { a: 1 };
expect(obj).toBe(obj);
```

#### Failing examples

```js
expect(47).toBe(48);
expect({ a: 1 }).toBe({ a: 1 });
```

### `toBeArray()`

Expects the actual value to be an array (using `Array.isArray`).

#### Passing examples

```js
expect([]).toBeArray();
expect([1, 2, 3]).toBeArray();
```

#### Failing examples

```js
expect(47).toBeArray();
expect({}).toBeArray();
```

### `toBeCloseTo(expected: number, precision?: number)`

Expects the actual value to be a number that is within a certain number of decimal places of the `expected` number. The number of decimal places (`precision`) is optional. The default is 2.

This matcher is necessary because of the way fractional number values work in JavaScript. For more information on this, [read this blog post](http://adripofjavascript.com/blog/drips/avoiding-problems-with-decimal-math-in-javascript.html).

#### Passing examples

```js
expect(0.1 + 0.2).toBeCloseTo(0.3);
expect(0.001).toBeCloseTo(0.001001, 3);
```

#### Failing examples

```js
expect(0.1).toBeCloseTo(0.2);
expect(47).toBeCloseTo(47.001, 5);
```

### `toBeDefined()`

Expects the actual value to be anything but `undefined`.

#### Passing examples

```js
expect(true).toBeDefined();
expect({}).toBeDefined();
expect(null).toBeDefined();
```

#### Failing examples

```js
expect(undefined).toBeDefined();
const obj = {};
expect(obj.missingProperty).toBeDefined();
```

### `toBeEmpty()`

Expects the actual value to be either an empty string (`''`), an empty array (`[]`), or an empty object (`{}`).

#### Passing examples

```js
expect('').toBeEmpty();
expect([]).toBeEmpty();
expect({}).toBeEmpty();
```

#### Failing examples

```js
expect('hello').toBeEmpty();
expect(undefined).toBeEmpty();
```

### `toBeFalsy()`

Expects the actual value to be falsy. Falsy values in JavaScript include: `false`, `null`, `undefined`, `0`, `''`, and `NaN`.

#### Passing examples

```js
expect(false).toBeFalsy();
expect(null).toBeFalsy();
expect(undefined).toBeFalsy();
```

#### Failing examples

```js
expect(true).toBeFalsy();
```

### `toBeGreaterThan(expected: number)`

### `toBeGreaterThanOrEqual(expected: number)`

### `toBeInstanceOf(expected: Function)`

### `toBeLessThan(expected: number)`

### `toBeLessThanOrEqual(expected: number)`

### `toBeNull()`

### `toBeTruthy()`

### `toBeUndefined()`

Expects the actual value to be `undefined`.

#### Passing examples

```js
expect(undefined).toBeUndefined();
const obj = {};
expect(obj.missingProperty).toBeUndefined();
```

#### Failing examples

```js
expect(true).toBeUndefined();
expect({}).toBeUndefined();
expect(null).toBeUndefined();
```

### `toEqual(expected: any)`

### `toHaveClass(expected: string | string[])`

### `toHaveLength(expected: number)`

### `toHaveProperty(key: string, value?: any)`

### `toHaveType(expected: string)`

### `toMatch(expected: string | RegExp)`

### `toSatisfy(predicate: Function)`

### `toThrow(expected?: string | RegExp | Function)`

## Modifiers

### `not`

### `resolves`

### `rejects`

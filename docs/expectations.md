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

Expects the actual value to be greater than a given number (using `>`).

#### Passing examples

```js
expect(47).toBeGreaterThan(0);
expect(0).toBeGreaterThan(-200);
```

#### Failing examples

```js
expect(1).toBeGreaterThan(2);
expect(1).toBeGreaterThan(1);
```

### `toBeGreaterThanOrEqual(expected: number)`

Expects the actual value to be greater than or equal to a given number (using `>=`).

#### Passing examples

```js
expect(47).toBeGreaterThanOrEqual(0);
expect(0).toBeGreaterThanOrEqual(-200);
expect(1).toBeGreaterThanOrEqual(1);
```

#### Failing examples

```js
expect(1).toBeGreaterThanOrEqual(2);
expect(-1).toBeGreaterThanOrEqual(0);
```

### `toBeInstanceOf(expected: Class)`

Expects the actual value to be an instance of the expected class (using the `instanceof` operator).

#### Passing examples

```js
expect({}).toBeInstanceOf(Object);
expect(/wow/).toBeInstanceOf(RegExp);
expect(() => {}).toBeInstanceOf(Function);
```

#### Failing examples

```js
expect('a string').toBeInstanceOf(RegExp);
expect(47).toBeInstanceOf(Function);
```

### `toBeLessThan(expected: number)`

Expects the actual value to be less than a given number (using `<`).

#### Passing examples

```js
expect(0).toBeLessThanOr(47);
expect(-200).toBeLessThanOr(0);
```

#### Failing examples

```js
expect(2).toBeLessThanOr(1);
expect(0).toBeLessThanOr(-10);
expect(1).toBeLessThanOr(1);
```

### `toBeLessThanOrEqual(expected: number)`

Expects the actual value to be less than or equal to a given number (using `<=`).

#### Passing examples

```js
expect(0).toBeLessThanOrEqual(47);
expect(-200).toBeLessThanOrEqual(0);
expect(1).toBeLessThanOrEqual(1);
```

#### Failing examples

```js
expect(2).toBeLessThanOrEqual(1);
expect(0).toBeLessThanOrEqual(-10);
```

### `toBeNull()`

Expects the actual value to be `null`.

#### Passing examples

```js
expect(null).toBeNull();
const obj = { prop: null };
expect(obj.prop).toBeNull();
```

#### Failing examples

```js
expect(true).toBeNull();
expect({}).toBeNull();
expect(undefined).toBeNull();
```

### `toBeTruthy()`

Expects the actual value to be any non-falsy value. Falsy values in JavaScript include: `false`, `null`, `undefined`, `0`, `''`, and `NaN`.

#### Passing examples

```js
expect(true).toBeTruthy();
expect('hello').toBeTruthy();
expect({}).toBeTruthy();
```

#### Failing examples

```js
expect(false).toBeTruthy();
expect(undefined).toBeTruthy();
```

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

### `toContain(expected: any)`

If the actual value is an array, expects the array to contain an element that is equal to `expected` (checking for deep equality, like `toEqual` does). If the actual value is a string, expects the string to contain the substring `expected`.

#### Passing examples

```js
expect([1, 2, 3]).toContain(2);
expect([{ a: 1 }, { b: 2 }]).toContain({ b: 2 });
expect('hello, world').toContain('hello');
```

#### Failing examples

```js
expect([1, 2, 3]).toContain(4);
expect('hello, world').toContain('test');
```

### `toEqual(expected: any)`

Expects the actual value to be deeply equal to the expected value. This means that for objects and arrays, every property/element will be checked recursively for deep equality.

#### Passing examples

```js
expect(47).toEqual(47);
expect('test').toEqual('test');
expect([1, 2, 3]).toEqual([1, 2, 3]);
expect({ a: 1, b: { hello: 'world' } }).toEqual({ a: 1, b: { hello: 'world' } });
```

#### Failing examples

```js
expect('hello').toEqual('world');
expect([1, 2, 3]).toEqual([1, 2, 3, 4]);
expect({ a: 1 }).toEqual({ a: 1, b: 2 });
```

### `toHaveBeenCalled()`

Expects that a [mock function](mocks.md) has been called at least once.

This looks at the current call count, which is the number of times the function was called since the mock was created, or since its calls were last reset.

#### Passing examples

```js
const myFunction = mock.func();
myFunction();
expect(myFunction).toHaveBeenCalled();
```

#### Failing examples

```js
const myFunction = mock.func();
expect(myFunction).toHaveBeenCalled();
```

### `toHaveBeenCalledTimes(count: number)`

Expects that a [mock function](mocks.md) has been called a given number of times.

This looks at the current call count, which is the number of times the function was called since the mock was created, or since its calls were last reset.

#### Passing examples

```js
const myFunction = mock.func();
myFunction();
myFunction();
expect(myFunction).toHaveBeenCalledTimes(2);
```

#### Failing examples

```js
const myFunction = mock.func();
myFunction();
expect(myFunction).toHaveBeenCalledTimes(100);
```

### `toHaveBeenCalledWith(...args: any[])`

Expects that a [mock function](mocks.md) has been called at least once with the given set of arguments.

#### Passing examples

```js
const numberFunction = mock.func();
numberFunction(1);
numberFunction(2);
numberFunction(3);
expect(numberFunction).toHaveBeenCalledWith(2);

const logFunction = mock.func();
logFunction('hello', 'world');
expect(logFunction).toHaveBeenCalledWith('hello', 'world');
```

#### Failing examples

```js
const myFunction = mock.func();
myFunction();
expect(myFunction).toHaveBeenCalledWith('some argument');
```

### `toHaveClass(expected: string | string[])`

Expects that a DOM node has a given class name, or all given class names.

If given an array, expects the node to have all class names in the array. If given a string with multiple space-separated class names, it will expect the node to have each of the class names (in any order).

#### Passing examples

```js
const div = document.createElement('div');
div.className = 'class-one class-two';
expect(div).toHaveClass('class-one');
expect(div).toHaveClass('class-two');
expect(div).toHaveClass('class-one class two');
expect(div).toHaveClass(['class-one', 'class two']);
```

#### Failing examples

```js
const div = document.createElement('div');
div.className = 'class-one class-two';
expect(div).toHaveClass('class-three');
expect(div).toHaveClass('class-one class two class-three');
expect(div).toHaveClass(['class-one', 'class two', 'class three']);
```

### `toHaveLength(expected: number)`

Expects that the actual value has a given length.

This just looks for a `.length` property, so it will work on an array, a string, and anything else that has a `.length` property.

#### Passing examples

```js
expect('hello').toHaveLength(5);
expect([1, 2, 3]).toHaveLength(3);
expect({ length: 47 }).toHaveLength(47);
```

#### Failing examples

```js
expect('hi').toHaveLength(5);
expect([]).toHaveLength(1);
expect({ length: 0 }).toHaveLength(47);
```

### `toHaveProperty(key: string, value?: any)`

### `toHaveType(expected: string)`

### `toMatch(expected: string | RegExp)`

### `toSatisfy(predicate: Function)`

### `toThrow(expected?: string | RegExp | Function)`

## Modifiers

### `not`

### `resolves`

### `rejects`

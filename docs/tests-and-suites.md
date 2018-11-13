---
id: tests-and-suites
title: Tests and suites
---

With Testaway, you write tests using the `it` function (or the `test` function, which does the same thing). Tests can be grouped using the `describe` function (or its alias `suite`).

If you have written tests using libraries like Jasmine or Jest, this will seem very familiar. If not, that's fine! Read on for examples.

## Writing tests

### `it(name, testFunc)`

`it` creates a single test with a descriptive name. If the `testFunc` throws an error when it runs, the test will fail. If not, the test will pass.

```js
it('gets the correct result', () => {
  const result = myFunction();
  expect(result).toEqual('yes!');
});
```

Most often, you will write your tests using `expect`, but this is not a requirement. This is also a valid test:

```js
it('gets the correct result', () => {
  const result = myFunction();
  if (result !== 'yes!') {
    throw new Error('test failed');
  }
});
```

However, using `expect` will make your test code simpler and easier to read. See the page on [expectations](expectations.md) for more information.

### `fit(name, testFunc)`

`fit` marks a test as focused, meaning all other non-focused tests and suites will be skipped when the tests are run.

While working on tests, you may want to only run the tests you currently care about. This helps you do that.

```js
fit('focused, will run', () => {
  expect(true).toBeTruthy();
});

it('not focused, will be skipped', () => {
  expect(false).toBeTruthy();
});
```

### `xit(name, testFunc)`

`xit` marks a test as skipped, meaning it will not be run when the tests are run.

This is useful when you want to exclude tests that you are not currently working on.

```js
it('not skipped, will run', () => {
  expect(true).toBeTruthy();
});

xit('skipped, will not run', () => {
  expect(false).toBeTruthy();
});
```

### `it(name, options, testFunc)`

It is possible to pass options to `it` that change some settings for a specific test. To do this, the second argument to `it` should be an object. The `testFunc` becomes the third argument.

Options can also be given to `fit` and `xit` in the same way.

```js
it('should eventually complete', { timeout: 10000 }, async () => {
  const result = await longRunningAsyncFunc();
  expect(result).toBe('done!');
});
```

This is useful when you would like to change the settings for only one test. For example, if you know that a certain test will take a long time to complete, you can increase the `timeout` for only that test.

If options are not given, a test will inherit the options configured in a parent suite (or the defaults, if not configured). For a full explanation of how test options work, see the [options](test-options.md) page.

### `test`/`ftest`/`xtest`

Testaway also provides the `test`, `ftest`, and `xtest` functions as aliases to `it`, `fit` and `xit`, respectively. They behave exactly the same way as their counterparts.

```js
test('not skipped or focused', () => {
  expect(true).toBeTruthy();
});

ftest('focused', () => {
  expect(false).toBeTruthy();
});

xtest('skipped', () => {
  expect(false).toBeTruthy();
});

test('with options', { timeout: 20000 }, async () => {
  expect(await somethingAsync()).toBeTruthy();
});
```

These aliases exist to give you more flexibility in writing easy-to-understand tests. Sometimes, the `describe`/`it` pattern will make for the clearest tests, but sometimes you may prefer `test`. If you aren't sure which one to use, just pick one and remain consistent.

## Writing suites

### `describe(name, suiteFunc)`

`describe` lets you group tests together into a "suite." Suites should be given descriptive names that explain the grouping.

Suites can be nested inside one another to create deeper levels of grouping.

```js
describe('FancyMath module', () => {
  describe('add method', () => {
    it('works on positive numbers', () => {
      expect(FancyMath.add(2, 2)).toEqual(4);
    });
  });

  describe('subtract method', () => {
    it('works on positive numbers', () => {
      expect(FancyMath.subtract(2, 1)).toEqual(1);
    });
  });
});
```

### `fdescribe(name, suiteFunc)`

Just like tests, suites can be focused. Use `fdescribe` to mark a suite as focused, and all non-focused suites and tests will be skipped.

```js
fdescribe('focused suite', () => {
  it('will run this test', () => {
    expect(true).toBeTruthy();
  });
});

describe('non-focused suite', () => {
  it('will not run this test', () => {
    expect(true).toBeTruthy();
  });
});
```

### `xdescribe(name, suiteFunc)`

Again, just like tests, suites can be explicitly skipped. Use `xdescribe` to mark a suite as skipped. This will also skip all suites nested within the skipped suite.

```js
xdescribe('skipped suite', () => {
  it('will not run this test', () => {
    expect(true).toBeTruthy();
  });

  describe('will not run this inner suite', () => {
    // any tests in here will not be run
    // because the parent suite is skipped
  });
});

describe('non-skipped suite', () => {
  it('will run this test', () => {
    expect(true).toBeTruthy();
  });
});
```

### `suite`/`fsuite`/`xsuite`

The `suite`/`fsuite`/`xsuite` functions are provided as aliases of `describe`/`fdescribe`/`xdescribe`. Choose them over the `describe` versions whenever doing so makes your tests easier to understand.

```js
suite('normal suite', () => {
  test('has a test', () => {
    expect(true).toBeTruthy();
  });
});

fsuite('focused suite', () => {
  test('has a test', () => {
    expect(true).toBeTruthy();
  });
});

xsuite('skipped suite', () => {
  test('has a test', () => {
    expect(true).toBeTruthy();
  });
});
```

## Test setup and teardown

Sometimes, you will want to set up some conditions before your tests run (and/or clean up things you set up for your tests). These functions help you do that.

If placed outside of a `describe` suite, these setup/teardown functions will apply to every test in the test run. If inside a suite, they will only apply to tests in that suite and any inner suites.

### `beforeEach(func)`

`beforeEach` takes a function that will be run before every test that follows it.

In this example, we use `beforeEach` to create a fresh instance of the `Counter` class for each test to work with.

```js
describe('Counter', () => {
  let counter;

  beforeEach(() => {
    counter = new Counter('my counter');
  });

  it('has a name', () => {
    expect(counter.getName()).toBe('my counter');
  });

  it('can be incremented', () => {
    expect(counter.getCount()).toBe(0);
    counter.increment();
    expect(counter.getCount()).toBe(1);
  });
});
```

### `afterEach(func)`

`afterEach` takes a function that will be run after every test that follows it.

In this example, we use `afterEach` to clear out `localStorage` between tests so they don't affect one another.

```js
afterEach(() => {
  localStorage.clear();
});

it('can store strings', () => {
  expect(localStorage.get('key')).toBeUndefined();
  myLocalStorageHelper.store('hello');
  expect(localStorage.get('key')).toBe('hello');
});

it('can store numbers', () => {
  expect(localStorage.get('key')).toBeUndefined();
  myLocalStorageHelper.store(47);
  expect(localStorage.get('key')).toBe('47');
});
```

### `beforeAll(func)`

`beforeAll` takes a function that will run once before all of the tests in the test run. If placed in a suite, it will run once before all of the tests in that suite.

In this example, we use `beforeAll` to do some asynchronous actions (opening a browser window and logging in) before running an integration-style test that needs a logged-in browser session.

```js
beforeAll(async () => {
  await openBrowser();
  await logIn();
});

it('has the right heading', async () => {
  const headingText = await getText('h2.my-heading');
  expect(headingText).toBe('You are logged in!');
});
```

### `afterAll(func)`

`afterAll` takes a function that will run once after all of the tests in the test run. If placed in a suite, it will run once after all of the tests in that suite.

In this example, we use `afterAll` with some integration-style tests to close down a browser window after all tests have run.

```js
beforeAll(async () => {
  await openBrowser();
});

afterAll(async () => {
  await closeBrowser();
});

it('has a heading', async () => {
  const text = await getText('h1');
  expect(text).toBe('Hello, world');
});

it('has a log-in button', async () => {
  const button = await getText('button.log-in');
  expect(button).toBe('Click to log in');
});
```

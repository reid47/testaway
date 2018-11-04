import { ExpectationError } from './ExpectationError';
import { deepEqual } from './utils/deep-equal';
import { isPromise } from './utils/is-promise';
import { prettyPrint } from './utils/pretty-print';

interface Queryable {
  querySelectorAll(selector: string): NodeListOf<Element>;
}

export class Expectation {
  actual: any;
  negated: boolean;
  expectResolve: boolean;
  expectReject: boolean;
  domContext: Queryable | null;

  constructor(actual: any) {
    this.actual = actual;
    this.negated = false;
    this.expectResolve = false;
    this.expectReject = false;
    this.domContext = typeof document !== 'undefined' ? document : null;
  }

  get not(): Expectation {
    this.negated = true;
    return this;
  }

  // get resolves(): Expectation {
  //   this.expectResolve = true;
  //   return this;
  // }

  // get rejects(): Expectation {
  //   this.expectReject = true;
  //   return this;
  // }

  // in(domNodeOrSelector: Element | string): Expectation {
  //   if (typeof document === 'undefined') {
  //     throw new Error('.in requires document to be available (e.g. in a browser)');
  //   }

  //   let newContext;
  //   if (typeof domNodeOrSelector === 'string') {
  //     const nodes = document.querySelectorAll(domNodeOrSelector);

  //     if (nodes.length < 1) {
  //       throw new Error('No matches found for selector ' + domNodeOrSelector);
  //     } else if (nodes.length > 1) {
  //       throw new Error(
  //         `Expected only one match for selector '${domNodeOrSelector}'. ${nodes.length} found.`
  //       );
  //     }

  //     newContext = nodes[0];
  //     if (!newContext) throw new Error('Could not find element matching ' + domNodeOrSelector);
  //   } else {
  //     newContext = domNodeOrSelector;
  //   }

  //   this.domContext = newContext;
  //   return this;
  // }

  toBe(expected: any) {
    const pass = Object.is(this.actual, expected);
    return this.assert(pass, 'toBe', 'to be', ['expected'], [expected]);
  }

  toBeDefined() {
    const pass = this.actual !== void 0;
    return this.assert(pass, 'toBeDefined', 'to be defined', [], []);
  }

  toBeFalsy() {
    const pass = !this.actual;
    return this.assert(pass, 'toBeFalsy', 'to be falsy', [], []);
  }

  toBeGreaterThan(expected: number) {
    const pass = this.actual > expected;
    return this.assert(pass, 'toBeGreaterThan', 'to be greater than', ['expected'], [expected]);
  }

  toBeGreaterThanOrEqual(expected: number) {
    const pass = this.actual >= expected;
    return this.assert(
      pass,
      'toBeGreaterThanOrEqual',
      'to be greater than or equal',
      ['expected'],
      [expected]
    );
  }

  toBeInstanceOf(expected: Function) {
    const pass = this.actual instanceof expected;
    return this.assert(pass, 'toBeInstanceOf', 'to be an instance of', ['expected'], [expected]);
  }

  toBeLessThan(expected: number) {
    const pass = this.actual < expected;
    return this.assert(pass, 'toBeLessThan', 'to be less than', ['expected'], [expected]);
  }

  toBeLessThanOrEqual(expected: number) {
    const pass = this.actual <= expected;
    return this.assert(
      pass,
      'toBeLessThanOrEqual',
      'to be less than or equal',
      ['expected'],
      [expected]
    );
  }

  toBeNull() {
    const pass = this.actual === null;
    return this.assert(pass, 'toBeNull', 'to be null', [], []);
  }

  toBeTruthy() {
    const pass = !!this.actual;
    return this.assert(pass, 'toBeTruthy', 'to be truthy', [], []);
  }

  toBeUndefined() {
    const pass = this.actual === void 0;
    return this.assert(pass, 'toBeUndefined', 'to be undefined', [], []);
  }

  // toEqual(expected: any) {
  //   const { equal, reason } = deepEqual(expected, this.actual);
  //   return this.assert(equal, this.toEqual, [expected], reason);
  // }

  toHaveLength(expected: number) {
    const actualLength = this.actual.length;
    const pass = actualLength === expected;
    const additionalInfo = this.negated ? undefined : [['but actual length was', actualLength]];
    return this.assert(
      pass,
      'toHaveLength',
      'to have length',
      ['expected'],
      [expected],
      additionalInfo
    );
  }

  toHaveProperty(key: string, value?: any) {
    const hasProperty = this.actual.hasOwnProperty(key);

    const expectingValue = arguments.length > 1;
    if (!expectingValue) {
      return this.assert(hasProperty, 'toHaveProperty', 'to have property', ['property'], [key]);
    }

    const actualValue = this.actual[key];
    const hasCorrectValue = this.actual[key] === value;
    const additionalInfo = [
      ['with value', value],
      [`but actual value for ${prettyPrint(key)} was`, actualValue]
    ];

    return this.assert(
      hasCorrectValue,
      'toHaveProperty',
      'to have property',
      ['property', 'value'],
      [key, value],
      additionalInfo
    );
  }

  toHaveType(expected: string) {
    const actualType = typeof this.actual;
    const pass = actualType === expected;
    const additionalInfo = this.negated ? undefined : [['but actual type was', actualType]];
    return this.assert(
      pass,
      'toHaveType',
      'to have type',
      ['expected'],
      [expected],
      additionalInfo
    );
  }

  // toHaveText(expected: string) {
  //   if (!this.domContext) throw new Error('No DOM context');

  //   if (typeof this.actual === 'string') {
  //     const nodes = this.domContext.querySelectorAll(this.actual);
  //     if (nodes.length < 1) throw new Error('No nodes matching ' + this.actual);
  //     if (nodes.length > 1) throw new Error('Multiple nodes matching ' + this.actual);
  //     this.actual = nodes[0];
  //   }

  //   const pass = this.actual.textContent === expected;
  //   return this.assert(pass, this.toHaveText, [expected]);
  // }

  toMatch(expected: string | RegExp) {
    const givenString = typeof expected === 'string';

    const pass = givenString
      ? this.actual.indexOf(expected) > -1
      : (expected as RegExp).test(this.actual);

    const phrase = givenString ? 'to contain string' : 'to match regular expression';
    const param = givenString ? 'string' : 'regex';

    return this.assert(pass, 'toMatch', phrase, [param], [expected]);
  }

  toThrow(expected?: string | RegExp | Function) {
    if (typeof this.actual !== 'function') {
      throw new Error('toThrow(...) expects a function to be passed to expect(...)');
    }

    let caught = null;
    try {
      this.actual();
    } catch (thrown) {
      caught = thrown;
    }

    const threwAnything = !!caught;

    if (!arguments.length) {
      return this.assert(threwAnything, 'toThrow', 'to throw', [], []);
    }

    if (typeof expected === 'function') {
      const pass = caught instanceof expected;
      return this.assert(
        pass,
        'toThrow',
        'to throw an instance of',
        ['errorType'],
        [expected],
        threwAnything ? undefined : ['but it did not throw.']
      );
    }

    const caughtMessage = caught instanceof Error ? caught.message : String(caught);

    if (expected instanceof RegExp) {
      return this.assert(
        expected.test(caughtMessage),
        'toThrow',
        'to throw an error matching regular expression',
        ['regex'],
        [expected],
        threwAnything ? undefined : ['but it did not throw.']
      );
    }

    return this.assert(
      caughtMessage.indexOf('' + expected) > -1,
      'toThrow',
      'to throw an error containing string',
      ['string'],
      [expected],
      threwAnything ? undefined : ['but it did not throw.']
    );
  }

  assert(
    condition: boolean,
    matcherName: string,
    matcherPhrase: string,
    matcherParamNames: string[],
    matcherArgs: any[],
    additionalInfo?: any[]
  ) {
    if (!this.negated && condition) return;
    if (this.negated && !condition) return;

    throw ExpectationError.create(
      this,
      matcherName,
      matcherPhrase,
      matcherParamNames,
      matcherArgs,
      additionalInfo
    );
  }
}

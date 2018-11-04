import { ExpectationError } from './ExpectationError';
import { deepEqual } from './utils/deep-equal';
import { prettyPrint } from './utils/pretty-print';
import { typeOf } from './utils/type-of';
import { ValueType } from './types';

interface Queryable {
  querySelectorAll(selector: string): NodeListOf<Element>;
}

export class Expectation {
  actual: any;
  negated: boolean;
  async: number;
  alreadyResolved: boolean;
  alreadyRejected: boolean;
  domContext: Queryable | null;

  constructor(actual: any) {
    this.actual = actual;
    this.negated = false;
    this.async = 0;
    this.alreadyResolved = false;
    this.alreadyRejected = false;
    this.domContext = typeof document !== 'undefined' ? document : null;
  }

  get not(): Expectation {
    this.negated = true;
    return this;
  }

  get resolves(): Expectation {
    this.async = 1;
    return this;
  }

  get rejects(): Expectation {
    this.async = -1;
    return this;
  }

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

  toBe(expected: any): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBe(expected));

    const pass = Object.is(this.actual, expected);

    let additionalInfo;
    if (typeOf(this.actual) === ValueType.object && typeOf(expected) === ValueType.object) {
      additionalInfo = [
        '',
        'Checked for reference equality because both values are objects. ' +
          'To check for structural equality, use toEqual.'
      ];
    }

    return this.assert(pass, 'toBe', 'to be', ['expected'], [expected], additionalInfo);
  }

  toBeCloseTo(value: number, precision: number = 2): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeCloseTo(value, precision));

    const pow = Math.pow(10, precision + 1);
    const delta = Math.abs(value - this.actual);
    const maxDelta = Math.pow(10, -precision) / 2;
    const pass = Math.round(delta * pow) / pow <= maxDelta;
    return this.assert(
      pass,
      'toBeCloseTo',
      `to be close to (precision: ${precision} decimal points)`,
      ['value'],
      [value]
    );
  }

  toBeDefined(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeDefined());

    const pass = this.actual !== void 0;
    return this.assert(pass, 'toBeDefined', 'to be defined', [], []);
  }

  toBeFalsy(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeFalsy());

    const pass = !this.actual;
    return this.assert(pass, 'toBeFalsy', 'to be falsy', [], []);
  }

  toBeGreaterThan(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeGreaterThan(expected));

    const pass = this.actual > expected;
    return this.assert(pass, 'toBeGreaterThan', 'to be greater than', ['expected'], [expected]);
  }

  toBeGreaterThanOrEqual(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeGreaterThanOrEqual(expected));

    const pass = this.actual >= expected;
    return this.assert(
      pass,
      'toBeGreaterThanOrEqual',
      'to be greater than or equal',
      ['expected'],
      [expected]
    );
  }

  toBeInstanceOf(expected: Function): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeInstanceOf(expected));

    const pass = this.actual instanceof expected;
    return this.assert(pass, 'toBeInstanceOf', 'to be an instance of', ['expected'], [expected]);
  }

  toBeLessThan(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeLessThan(expected));

    const pass = this.actual < expected;
    return this.assert(pass, 'toBeLessThan', 'to be less than', ['expected'], [expected]);
  }

  toBeLessThanOrEqual(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeLessThanOrEqual(expected));

    const pass = this.actual <= expected;
    return this.assert(
      pass,
      'toBeLessThanOrEqual',
      'to be less than or equal',
      ['expected'],
      [expected]
    );
  }

  toBeNull(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeNull());

    const pass = this.actual === null;
    return this.assert(pass, 'toBeNull', 'to be null', [], []);
  }

  toBeTruthy(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeTruthy());

    const pass = !!this.actual;
    return this.assert(pass, 'toBeTruthy', 'to be truthy', [], []);
  }

  toBeUndefined(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeUndefined());

    const pass = this.actual === void 0;
    return this.assert(pass, 'toBeUndefined', 'to be undefined', [], []);
  }

  toEqual(expected: any): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toEqual(expected));

    const { equal, reasons } = deepEqual(expected, this.actual);
    return this.assert(
      equal,
      'toEqual',
      'to equal',
      ['expected'],
      [expected],
      this.negated ? undefined : reasons
    );
  }

  toHaveLength(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toHaveLength(expected));

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

  toHaveProperty(key: string, value?: any): void | Promise<void> {
    if (this.async) {
      const args = arguments;
      return this.awaitActual().then(x => {
        if (!x) return;
        if (args.length < 2) return x.toHaveProperty(key);
        return x.toHaveProperty(key, value);
      });
    }

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

  toHaveType(expected: string): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toHaveType(expected));

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

  toMatch(expected: string | RegExp): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toMatch(expected));

    const givenString = typeof expected === 'string';

    const pass = givenString
      ? this.actual.indexOf(expected) > -1
      : (expected as RegExp).test(this.actual);

    const phrase = givenString ? 'to contain string' : 'to match regular expression';
    const param = givenString ? 'string' : 'regex';

    return this.assert(pass, 'toMatch', phrase, [param], [expected]);
  }

  toThrow(expected?: string | RegExp | Function): void | Promise<void> {
    if (this.async) {
      const args = arguments;
      return this.awaitActual().then(x => {
        if (!x) return;
        if (args.length < 1) return x.toThrow();
        return x.toThrow(expected);
      });
    }

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

  extend(modifyPrototype: (exp: Expectation) => void) {
    modifyPrototype(Expectation.prototype);
  }

  private awaitActual() {
    if (this.async > 0) return this.awaitResolve();
    return this.awaitReject();
  }

  private awaitResolve() {
    return Promise.resolve()
      .then(() => this.actual)
      .then(
        resolved => {
          const exp = new Expectation(resolved);
          exp.domContext = this.domContext;
          exp.negated = this.negated;
          exp.alreadyResolved = true;
          return exp;
        },
        rejected =>
          this.assert(false, 'resolves', 'to resolve, but it rejected with', null, [rejected])
      );
  }

  private awaitReject() {
    return Promise.resolve()
      .then(() => this.actual)
      .then(
        resolved =>
          this.assert(false, 'rejects', 'to reject, but it resolved to', null, [resolved]),
        rejected => {
          const exp = new Expectation(rejected);
          exp.domContext = this.domContext;
          exp.negated = this.negated;
          exp.alreadyRejected = true;
          return exp;
        }
      );
  }

  private assert(
    condition: boolean,
    matcherName: string,
    matcherPhrase: string,
    matcherParamNames: string[] | null,
    matcherArgs: any[],
    additionalInfo?: any[]
  ) {
    if (!this.negated && condition) return;
    if (this.negated && !condition) return;

    throw new ExpectationError(
      this,
      matcherName,
      matcherPhrase,
      matcherParamNames,
      matcherArgs,
      additionalInfo
    );
  }
}

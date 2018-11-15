import { ExpectationError } from './ExpectationError';
import { deepEqual } from './utils/deep-equal';
import { prettyPrint } from './utils/pretty-print';
import { typeOf } from './utils/type-of';
import { MOCK_PROPERTY, ARGUMENTS_PROPERTY } from './constants';
import { Mock } from './Mock';

const isDomElement = (obj: any) =>
  obj && obj.classList && typeof obj.classList.contains === 'function';

const isMockFunction = (f: any) => typeof f === 'function' && f.mock && f.mock[MOCK_PROPERTY];

const times = (n: number) => (n === 1 ? `${n} time` : `${n} times`);

interface Queryable {
  querySelectorAll(selector: string): NodeListOf<Element>;
}

export class Expectation {
  stack?: string;
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

    let additionalLines;
    if (typeOf(this.actual) === 'object' && typeOf(expected) === 'object') {
      additionalLines = [
        '',
        'Checked for reference equality because both values are objects. ' +
          'To check for structural equality, use toEqual.'
      ];
    }

    return this.assert(
      Object.is(this.actual, expected),
      'toBe',
      'to be',
      ['expected'],
      [prettyPrint(expected)],
      additionalLines
    );
  }

  toBeArray(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeArray());

    return this.assert(Array.isArray(this.actual), 'toBeArray', 'to be an array', [], []);
  }

  toBeCloseTo(value: number, precision: number = 2): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeCloseTo(value, precision));

    const pow = Math.pow(10, precision + 1);
    const delta = Math.abs(value - this.actual);
    const maxDelta = Math.pow(10, -precision) / 2;

    return this.assert(
      Math.round(delta * pow) / pow <= maxDelta,
      'toBeCloseTo',
      `to be close to (precision: ${precision} decimal points)`,
      ['value'],
      [prettyPrint(value)]
    );
  }

  toBeDefined(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeDefined());

    return this.assert(this.actual !== void 0, 'toBeDefined', 'to be defined', [], []);
  }

  toBeEmpty(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeDefined());

    let pass = false;
    if (Array.isArray(this.actual) || typeof this.actual === 'string') {
      pass = this.actual.length === 0;
    } else if (this.actual && typeof this.actual === 'object') {
      pass = Object.keys(this.actual).length === 0;
    }

    return this.assert(pass, 'toBeEmpty', 'to be empty', [], []);
  }

  toBeFalsy(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeFalsy());

    return this.assert(!this.actual, 'toBeFalsy', 'to be falsy', [], []);
  }

  toBeGreaterThan(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeGreaterThan(expected));

    return this.assert(
      this.actual > expected,
      'toBeGreaterThan',
      'to be greater than',
      ['expected'],
      [prettyPrint(expected)]
    );
  }

  toBeGreaterThanOrEqual(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeGreaterThanOrEqual(expected));

    return this.assert(
      this.actual >= expected,
      'toBeGreaterThanOrEqual',
      'to be greater than or equal',
      ['expected'],
      [prettyPrint(expected)]
    );
  }

  toBeInstanceOf(expected: Function): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeInstanceOf(expected));

    return this.assert(
      this.actual instanceof expected,
      'toBeInstanceOf',
      'to be an instance of',
      ['expected'],
      [prettyPrint(expected)]
    );
  }

  toBeLessThan(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeLessThan(expected));

    return this.assert(
      this.actual < expected,
      'toBeLessThan',
      'to be less than',
      ['expected'],
      [prettyPrint(expected)]
    );
  }

  toBeLessThanOrEqual(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeLessThanOrEqual(expected));

    return this.assert(
      this.actual <= expected,
      'toBeLessThanOrEqual',
      'to be less than or equal',
      ['expected'],
      [prettyPrint(expected)]
    );
  }

  toBeNull(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeNull());

    return this.assert(this.actual === null, 'toBeNull', 'to be null', [], []);
  }

  toBeTruthy(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeTruthy());

    return this.assert(!!this.actual, 'toBeTruthy', 'to be truthy', [], []);
  }

  toBeUndefined(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toBeUndefined());

    return this.assert(this.actual === void 0, 'toBeUndefined', 'to be undefined', [], []);
  }

  toContain(expected: any): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toContain(expected));

    const isArray = Array.isArray(this.actual);
    const pass = isArray
      ? this.actual.some((element: any) => deepEqual(expected, element).equal)
      : this.actual.indexOf(expected) > -1;

    return this.assert(
      pass,
      'toContain',
      `to contain ${isArray ? 'element' : 'substring'}`,
      ['expected'],
      [prettyPrint(expected)]
    );
  }

  toEqual(expected: any): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toEqual(expected));

    const { equal, reasons } = deepEqual(expected, this.actual);

    return this.assert(
      equal,
      'toEqual',
      'to equal',
      ['expected'],
      [prettyPrint(expected)],
      this.negated ? undefined : reasons
    );
  }

  toHaveBeenCalled(): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toHaveBeenCalled());

    if (!isMockFunction(this.actual)) {
      return this.fail(
        'incorrect-usage',
        'toHaveBeenCalled',
        'to be a mock function',
        [],
        [],
        ['', 'toHaveBeenCalled can only be used with mock functions.']
      );
    }

    return this.assert(
      this.actual.mock.callCount > 0,
      'toHaveBeenCalled',
      this.negated ? 'to have been called' : 'to have been called at least once',
      [],
      []
    );
  }

  toHaveBeenCalledTimes(count: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toHaveBeenCalledTimes(count));

    if (!isMockFunction(this.actual)) {
      return this.fail(
        'incorrect-usage',
        'toHaveBeenCalledTimes',
        'to be a mock function',
        ['count'],
        [],
        ['', 'toHaveBeenCalledTimes can only be used with mock functions.']
      );
    }

    const { callCount } = this.actual.mock;
    return this.assert(
      callCount === count,
      'toHaveBeenCalledTimes',
      'to have been called',
      ['count'],
      [times(count)],
      this.negated
        ? undefined
        : callCount === 0
        ? ['but it was never called.']
        : ['but it was called:', `  ${times(callCount)}`]
    );
  }

  toHaveBeenCalledWith(...expectedArgs: any[]): void | Promise<void> {
    if (this.async) {
      return this.awaitActual().then(x => x && x.toHaveBeenCalledWith(...expectedArgs));
    }

    if (!isMockFunction(this.actual)) {
      return this.fail(
        'incorrect-usage',
        'toHaveBeenCalledWith',
        'to be a mock function',
        ['...args'],
        [],
        ['', 'toHaveBeenCalledWith can only be used with mock functions.']
      );
    }

    const { calls, callCount } = this.actual.mock as Mock;
    const pass = calls.some(call => deepEqual(expectedArgs, call.args).equal);
    (expectedArgs as any)[ARGUMENTS_PROPERTY] = true;

    return this.assert(
      pass,
      'toHaveBeenCalledWith',
      'to have been called with',
      ['...args'],
      [prettyPrint(expectedArgs)],
      this.negated
        ? undefined
        : callCount === 0
        ? ['but it was never called.']
        : [
            'but it was called with:',
            ...calls.map(({ args }, i) => {
              args[ARGUMENTS_PROPERTY] = true;
              const prefix = calls.length > 1 ? `call #${i}: ` : '';
              return `  ${prefix}${prettyPrint(args)}`;
            })
          ]
    );
  }

  toHaveClass(expected: string | string[]): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toHaveClass(expected));

    if (!isDomElement(this.actual)) {
      return this.fail(
        'incorrect-usage',
        'toHaveClass',
        'to be a DOM node with class',
        ['expected'],
        [prettyPrint(expected)],
        ['but it was not a DOM node.']
      );
    }

    const expectedClasses =
      typeof expected === 'string'
        ? expected
            .split(/\s+/)
            .map(s => s.trim())
            .filter(Boolean)
        : expected;

    const pass = expectedClasses.every(cls => this.actual.classList.contains(cls));

    return this.assert(
      pass,
      'toHaveClass',
      `to have class${expectedClasses.length > 1 ? 'es' : ''}`,
      ['expected'],
      [prettyPrint(expectedClasses.join(' '))],
      ['but actual classes were:', prettyPrint(this.actual.className, 1)]
    );
  }

  toHaveLength(expected: number): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toHaveLength(expected));

    const actualLength = this.actual.length;
    const additionalLines = this.negated
      ? undefined
      : ['but actual length was:', prettyPrint(actualLength, 1)];

    return this.assert(
      actualLength === expected,
      'toHaveLength',
      'to have length',
      ['expected'],
      [prettyPrint(expected)],
      additionalLines
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
      return this.assert(
        hasProperty,
        'toHaveProperty',
        'to have property',
        ['property'],
        [prettyPrint(key)]
      );
    }

    const actualValue = this.actual[key];
    const hasCorrectValue = this.actual[key] === value;
    const additionalLines = [
      'with value:',
      prettyPrint(value, 1),
      `but actual value for ${prettyPrint(key)} was:`,
      prettyPrint(actualValue, 1)
    ];

    return this.assert(
      hasCorrectValue,
      'toHaveProperty',
      'to have property',
      ['property', 'value'],
      [prettyPrint(key)],
      additionalLines
    );
  }

  toHaveType(expected: string): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toHaveType(expected));

    const actualType = typeof this.actual;
    const pass = actualType === expected;
    const additionalLines = this.negated
      ? undefined
      : ['but actual type was:', prettyPrint(actualType, 1)];

    return this.assert(
      pass,
      'toHaveType',
      'to have type',
      ['expected'],
      [prettyPrint(expected)],
      additionalLines
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
  //   return this.assert(pass, this.toHaveText, [prettyPrint(expected)]);
  // }

  toMatch(expected: string | RegExp): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toMatch(expected));

    const givenString = typeof expected === 'string';

    const pass = givenString
      ? this.actual.indexOf(expected) > -1
      : (expected as RegExp).test(this.actual);

    const phrase = givenString ? 'to contain string' : 'to match regular expression';
    const param = givenString ? 'string' : 'regex';

    return this.assert(pass, 'toMatch', phrase, [param], [prettyPrint(expected)]);
  }

  toSatisfy(predicate: Function): void | Promise<void> {
    if (this.async) return this.awaitActual().then(x => x && x.toSatisfy(predicate));

    return this.assert(
      predicate(this.actual),
      'toSatisfy',
      'to satisfy predicate function',
      ['predicate'],
      []
    );
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
      return this.assert(
        caught instanceof expected,
        'toThrow',
        'to throw an instance of',
        ['errorType'],
        [prettyPrint(expected)],
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
        [prettyPrint(expected)],
        threwAnything ? undefined : ['but it did not throw.']
      );
    }

    return this.assert(
      caughtMessage.indexOf('' + expected) > -1,
      'toThrow',
      'to throw an error containing string',
      ['string'],
      [prettyPrint(expected)],
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
    additionalLines?: any[]
  ) {
    if (!this.negated && condition) return;
    if (this.negated && !condition) return;

    this.fail(
      'assertion-failed',
      matcherName,
      matcherPhrase,
      matcherParamNames,
      matcherArgs,
      additionalLines
    );
  }

  private fail(
    reason: 'incorrect-usage' | 'assertion-failed',
    matcherName: string,
    matcherPhrase: string,
    matcherParamNames: string[] | null,
    matcherArgs: any[],
    additionalLines?: any[]
  ) {
    throw new ExpectationError(
      this,
      reason,
      matcherName,
      matcherPhrase,
      matcherParamNames,
      matcherArgs,
      additionalLines
    );
  }
}

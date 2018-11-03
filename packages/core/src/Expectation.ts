import { ExpectationError } from './ExpectationError';
import deepEqual from './utils/deep-equal';
import isPromise from './utils/is-promise';

interface Queryable {
  querySelectorAll(selector: string): NodeListOf<Element>;
}

export class Expectation {
  private actual: any;
  private negated: boolean;
  private expectResolve: boolean;
  private expectReject: boolean;
  private domContext: Queryable | null;

  constructor(actual: any) {
    this.actual = actual;
    this.negated = false;
    this.expectResolve = false;
    this.expectReject = false;
    this.domContext = typeof document !== 'undefined' ? document : null;
  }

  get not() {
    this.negated = true;
    return this;
  }

  get resolves() {
    this.expectResolve = true;
    return this;
  }

  get rejects() {
    this.expectReject = true;
    return this;
  }

  in(domNodeOrSelector: Element | string) {
    if (typeof document === 'undefined') {
      throw new Error('.in requires document to be available (e.g. in a browser)');
    }

    let newContext;
    if (typeof domNodeOrSelector === 'string') {
      const nodes = document.querySelectorAll(domNodeOrSelector);

      if (nodes.length < 1) {
        throw new Error('No matches found for selector ' + domNodeOrSelector);
      } else if (nodes.length > 1) {
        throw new Error(
          `Expected only one match for selector '${domNodeOrSelector}'. ${nodes.length} found.`
        );
      }

      newContext = nodes[0];
      if (!newContext) throw new Error('Could not find element matching ' + domNodeOrSelector);
    } else {
      newContext = domNodeOrSelector;
    }

    this.domContext = newContext;
    return this;
  }

  toBe(expected: any) {
    const pass = Object.is(this.actual, expected);
    return this.assert(pass, this.toBe, [expected]);
  }

  toBeDefined() {
    const pass = this.actual !== void 0;
    return this.assert(pass, this.toBeDefined, []);
  }

  toBeFalsy() {
    const pass = !this.actual;
    return this.assert(pass, this.toBeFalsy, []);
  }

  toBeGreaterThan(expected: number) {
    const pass = this.actual > expected;
    return this.assert(pass, this.toBeGreaterThan, [expected]);
  }

  toBeGreaterThanOrEqual(expected: number) {
    const pass = this.actual >= expected;
    return this.assert(pass, this.toBeGreaterThanOrEqual, [expected]);
  }

  toBeInstanceOf(expected: Function) {
    const pass = this.actual instanceof expected;
    return this.assert(pass, this.toBeInstanceOf, [expected]);
  }

  toBeLessThan(expected: number) {
    const pass = this.actual < expected;
    return this.assert(pass, this.toBeLessThan, [expected]);
  }

  toBeLessThanOrEqual(expected: number) {
    const pass = this.actual <= expected;
    return this.assert(pass, this.toBeLessThanOrEqual, [expected]);
  }

  toBeNull() {
    const pass = this.actual === null;
    return this.assert(pass, this.toBeNull, []);
  }

  toBeTruthy() {
    const pass = !!this.actual;
    return this.assert(pass, this.toBeTruthy, []);
  }

  toBeUndefined() {
    const pass = this.actual === void 0;
    return this.assert(pass, this.toBeUndefined, []);
  }

  toEqual(expected: any) {
    const { equal, reason } = deepEqual(expected, this.actual);
    return this.assert(equal, this.toEqual, [expected], reason);
  }

  toHaveType(expected: string) {
    const pass = typeof this.actual === expected;
    return this.assert(pass, this.toHaveType, [expected]);
  }

  toHaveLength(expected: number) {
    const pass = this.actual.length === expected;
    return this.assert(pass, this.toHaveLength, [expected]);
  }

  toHaveText(expected: string) {
    if (!this.domContext) throw new Error('No DOM context');

    if (typeof this.actual === 'string') {
      const nodes = this.domContext.querySelectorAll(this.actual);
      if (nodes.length < 1) throw new Error('No nodes matching ' + this.actual);
      if (nodes.length > 1) throw new Error('Multiple nodes matching ' + this.actual);
      this.actual = nodes[0];
    }

    const pass = this.actual.textContent === expected;
    return this.assert(pass, this.toHaveText, [expected]);
  }

  toMatch(expected: string | RegExp) {
    const pass =
      typeof expected === 'string' ? this.actual === expected : expected.test(this.actual);
    return this.assert(pass, this.toMatch, [expected]);
  }

  toThrow(expected?: string | RegExp) {
    if (typeof this.actual !== 'function') {
      throw new Error('.toThrow expects to operate on a function');
    }

    let pass = false;
    let error = null;

    try {
      this.actual();
    } catch (err) {
      error = err;
      const errorMessage = err instanceof Error ? error.message : String(err);
      if (typeof expected === 'string') pass = errorMessage.indexOf(expected) > -1;
      else if (expected instanceof RegExp) pass = expected.test(errorMessage);
    }

    return this.assert(pass, this.toThrow, [expected]);
  }

  assert(
    condition: boolean,
    matcher: (...obj: any[]) => void,
    matcherArgs: any[],
    additionalInfo?: string
  ) {
    if (this.expectResolve) {
      if (!isPromise(this.actual)) {
        throw new Error('.resolves expects a Promise');
      }

      return new Promise((resolve, reject) => {
        // TODO: this.actual.then
        if (!this.negated && condition) resolve();
        if (this.negated && !condition) resolve();
        reject(
          new ExpectationError(matcher, this.negated, this.actual, matcherArgs, additionalInfo)
        );
      });
    }

    if (!this.negated && condition) return;
    if (this.negated && !condition) return;
    throw new ExpectationError(matcher, this.negated, this.actual, matcherArgs, additionalInfo);
  }
}

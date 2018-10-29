import ExpectationError from './ExpectationError';
import deepEqual from '../utils/deep-equal';

export class Expectation {
  private actual: any;
  private negated: boolean;

  constructor(actual: any) {
    this.actual = actual;
    this.negated = false;
  }

  get not() {
    this.negated = !this.negated;
    return this;
  }

  toBe(expected: any) {
    const pass = Object.is(this.actual, expected);
    this.assert(pass, this.toBe, [expected]);
  }

  toBeDefined() {
    const pass = this.actual !== void 0;
    this.assert(pass, this.toBeUndefined, []);
  }

  toBeFalsy() {
    const pass = !this.actual;
    this.assert(pass, this.toBeFalsy, []);
  }

  toBeNull() {
    const pass = this.actual === null;
    this.assert(pass, this.toBeNull, []);
  }

  toBeTruthy() {
    const pass = !!this.actual;
    this.assert(pass, this.toBeTruthy, []);
  }

  toBeUndefined() {
    const pass = this.actual === void 0;
    this.assert(pass, this.toBeUndefined, []);
  }

  toEqual(expected: any) {
    const { equal, reason } = deepEqual(expected, this.actual);
    this.assert(equal, this.toEqual, [expected], reason);
  }

  assert(
    condition: boolean,
    matcher: (...obj: any[]) => void,
    matcherArgs: any[],
    additionalInfo?: string
  ) {
    if (!this.negated && condition) return;
    if (this.negated && !condition) return;
    throw new ExpectationError(matcher, this.negated, this.actual, matcherArgs, additionalInfo);
  }
}

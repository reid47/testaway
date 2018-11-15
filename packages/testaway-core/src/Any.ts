import { prettyPrint } from './utils/pretty-print';
import { deepEqual } from './utils/deep-equal';
import { ANY_PROPERTY } from './constants';
import { isFunction, isString, isRegExp, isArray, isObject, isMap, isSet } from './utils/is';

export class Any {
  readonly [ANY_PROPERTY]: boolean = true;
  expected: any;

  constructor(expected: any) {
    this.expected = expected;
  }

  matches(value: any) {
    return true;
  }

  toString() {
    return 'anything';
  }
}

class AnyConstructor extends Any {
  matches(value: any) {
    return (
      typeof value !== 'undefined' &&
      typeof value.constructor !== 'undefined' &&
      value.constructor === this.expected
    );
  }

  toString() {
    return `any ${this.expected.name}`;
  }
}

class AnyArrayContaining extends Any {
  matches(value: any) {
    if (!isArray(this.expected) || !isArray(value)) return false;

    return this.expected.every(expectedElement =>
      value.some(actualElement => deepEqual(expectedElement, actualElement).equal)
    );
  }

  toString() {
    return 'any array containing given elements (in any order)';
  }
}

class AnyFalsyValue extends Any {
  matches(value: any) {
    return !value;
  }

  toString() {
    return 'any falsy value';
  }
}

class AnyEmptyValue extends Any {
  matches(value: any) {
    if (isString(value) || isArray(value)) return value.length === 0;
    if (isMap(value) || isSet(value)) return value.size === 0;
    if (isObject(value)) return Object.keys(value).length === 0;

    return false;
  }

  toString() {
    return 'any empty string, array, object, Map, or Set';
  }
}

class AnySatisfying extends Any {
  matches(value: any) {
    return isFunction(this.expected) && !!this.expected(value);
  }

  toString() {
    return 'any value satisfying given function';
  }
}

class AnyStringContaining extends Any {
  matches(value: any) {
    return isString(value) && value.indexOf(this.expected) > -1;
  }

  toString() {
    return `any string containing ${prettyPrint(this.expected)}`;
  }
}

class AnyStringMatching extends Any {
  matches(value: any) {
    if (isString(value)) {
      if (isString(this.expected)) return value.indexOf(this.expected) > -1;
      if (isRegExp(this.expected)) return this.expected.test(value);
    }

    return false;
  }

  toString() {
    return `any string matching ${prettyPrint(this.expected)}`;
  }
}

class AnyTruthyValue extends Any {
  matches(value: any) {
    return !!value;
  }

  toString() {
    return 'any truthy value';
  }
}

const any = (ctor: Function) => new AnyConstructor(ctor);
any.arrayContaining = (expectedElements: any[]) => new AnyArrayContaining(expectedElements);
any.falsy = () => new AnyFalsyValue(null);
any.empty = () => new AnyEmptyValue(null);
any.satisfying = (predicate: Function) => new AnySatisfying(predicate);
any.stringContaining = (substring: String) => new AnyStringContaining(substring);
any.stringMatching = (match: String | RegExp) => new AnyStringMatching(match);
any.truthy = () => new AnyTruthyValue(null);

export { any };

import { prettyPrint } from './utils/pretty-print';
import { deepEqual } from './utils/deep-equal';
import { ANY_PROPERTY } from './constants';
import { isFunction, isString, isRegExp, isArray, isObject } from './utils/is';

type AnyStyle =
  | 'arrayContaining'
  | 'ctor'
  | 'empty'
  | 'falsy'
  | 'satisfying'
  | 'stringContaining'
  | 'stringMatching'
  | 'truthy';

export class Any {
  readonly [ANY_PROPERTY]: boolean = true;
  expected: any;
  style: AnyStyle;

  constructor(expected: any, style: AnyStyle) {
    this.expected = expected;
    this.style = style;
  }

  matches(value: any) {
    if (this.style === 'arrayContaining') {
      if (!isArray(this.expected) || !isArray(value)) return false;

      return this.expected.every(expectedElement =>
        value.some(actualElement => deepEqual(expectedElement, actualElement).equal)
      );
    }

    if (this.style === 'ctor') {
      return (
        typeof value !== 'undefined' &&
        typeof value.constructor !== 'undefined' &&
        value.constructor === this.expected
      );
    }

    if (this.style === 'empty') {
      if (isString(value)) return value.length === 0;
      if (Array.isArray(value)) return value.length === 0;
      if (isObject(value)) return Object.keys(value).length === 0;
    }

    if (this.style === 'falsy') {
      return !value;
    }

    if (this.style === 'satisfying') {
      return isFunction(this.expected) && !!this.expected(value);
    }

    if (this.style === 'stringContaining') {
      return isString(value) && value.indexOf(this.expected) > -1;
    }

    if (this.style === 'stringMatching') {
      if (isString(value)) {
        if (isString(this.expected)) return value.indexOf(this.expected) > -1;
        if (isRegExp(this.expected)) return this.expected.test(value);
      }
    }

    if (this.style === 'truthy') {
      return !!value;
    }

    return false;
  }

  toString() {
    let descriptor = '';

    switch (this.style) {
      case 'arrayContaining':
        descriptor = 'array containing given elements (in any order)';
        break;

      case 'ctor':
        descriptor = this.expected.name;
        break;

      case 'empty':
        descriptor = 'empty string, array, or object';
        break;

      case 'falsy':
        descriptor = 'falsy value';
        break;

      case 'satisfying':
        descriptor = 'value satisfying given function';
        break;

      case 'stringContaining':
        descriptor = `string containing ${prettyPrint(this.expected)}`;
        break;

      case 'stringMatching':
        descriptor = `string matching ${prettyPrint(this.expected)}`;
        break;

      case 'truthy':
        descriptor = 'truthy value';
        break;
    }

    return `any ${descriptor}`;
  }
}

const any = (ctor: Function) => new Any(ctor, 'ctor');
any.arrayContaining = (expectedElements: any[]) => new Any(expectedElements, 'arrayContaining');
any.falsy = () => new Any(null, 'falsy');
any.empty = () => new Any(null, 'empty');
any.satisfying = (predicate: Function) => new Any(predicate, 'satisfying');
any.stringContaining = (substring: String) => new Any(substring, 'stringContaining');
any.stringMatching = (match: String | RegExp) => new Any(match, 'stringMatching');
any.truthy = () => new Any(null, 'truthy');

export { any };

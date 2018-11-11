import { ValueType } from '../types';

export function typeOf(obj: any): ValueType {
  const type = typeof obj;

  switch (type) {
    case 'undefined':
    case 'boolean':
    case 'string':
    case 'number':
    case 'function':
    case 'symbol':
      return type;
    default:
      if (obj === null) return 'null';
      if (Array.isArray(obj)) return 'array';
      if (obj instanceof Date) return 'Date';
      if (obj instanceof RegExp) return 'RegExp';
      return 'object';
  }
}

export function stringTypeOf(obj: any): string {
  if (obj == null) return typeof obj;
  const type = typeOf(obj);
  const n = /aeiou/.test(type[0]) ? 'n' : '';
  return `a${n} ${type}`;
}

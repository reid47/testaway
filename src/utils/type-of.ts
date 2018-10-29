import { ValueType } from '../core/types';

export default function typeOf(obj: any): ValueType {
  switch (typeof obj) {
    case 'undefined':
      return ValueType.undefined;
    case 'boolean':
      return ValueType.boolean;
    case 'string':
      return ValueType.string;
    case 'number':
      return ValueType.number;
    case 'function':
      return ValueType.function;
    default:
      if (obj === null) return ValueType.null;
      if (Array.isArray(obj)) return ValueType.array;
      if (obj instanceof Date) return ValueType.date;
      if (obj instanceof RegExp) return ValueType.regexp;
      return ValueType.object;
  }
}

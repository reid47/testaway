import { Any } from '../Any';
import { Mock } from '../Mock';

const makeIndent = (amount: number): string => '  '.repeat(amount);

export function prettyPrint(obj: any, depth = 0): string {
  const type = typeof obj;
  const indent = makeIndent(depth);

  switch (type) {
    case 'undefined':
      return `${indent}${type}`;

    case 'number':
      return `${indent}${Object.is(-0, obj) ? '-0' : obj}`;

    case 'boolean':
      return `${indent}${obj}`;

    case 'string':
      return `${indent}"${obj}"`;

    case 'function':
      if (obj.mock instanceof Mock) return `${indent}${obj.toString()}`;
      return `${indent}[Function${obj.name ? `: ${obj.name}` : ''}]`;

    case 'symbol':
      return `${indent}${obj.toString()}`;
  }

  if (obj === null) {
    return `${indent}null`;
  }

  if (Array.isArray(obj)) {
    const shouldOneLine =
      obj.length < 5 &&
      obj.every(
        element =>
          typeof element === 'number' || typeof element === 'string' || typeof element === 'boolean'
      );

    if (shouldOneLine) {
      return `${indent}Array [${obj.map(element => prettyPrint(element)).join(', ')}]`;
    }

    // TODO: test all this...
    return `${indent}Array [${obj
      .map(element => `${indent}${prettyPrint(element, depth + 1)}\n`)
      .join(',')}]`;
  }

  if ('outerHTML' in obj) {
    return `${indent}${obj.outerHTML}`;
  }

  if (obj instanceof Date) {
    return `${indent}Date ${obj.toISOString()}`;
  }

  if (obj instanceof RegExp) {
    return `${indent}${obj.toString()}`;
  }

  if (obj instanceof Error) {
    const ctor = (obj.constructor && obj.constructor.name) || 'Error';
    return `${indent}${ctor}: ${obj.message}`;
  }

  if (type === 'object') {
    if (obj.__TESTAWAY__ANY__) return `${indent}${obj.toString()}`;

    const ctor = (obj.constructor && obj.constructor.name) || 'Object';
    const keys = Object.keys(obj);
    if (!keys.length) return `${indent}${ctor} {}`;

    const shouldOneLine =
      keys.length < 5 &&
      keys.every(
        key =>
          typeof obj[key] === 'number' ||
          typeof obj[key] === 'string' ||
          typeof obj[key] === 'boolean'
      );

    if (shouldOneLine) {
      return `${indent}${ctor} { ${keys
        .map(key => `${key}: ${prettyPrint(obj[key])}`)
        .join(', ')} }`;
    }

    return (
      `${indent}${ctor} {` +
      '\n' +
      keys
        .map((key, i) => {
          const comma = i < keys.length - 1 ? ',' : '';
          return `${prettyPrint(key, depth + 1)}: ${prettyPrint(
            obj[key],
            depth + 1
          ).trim()}${comma}`;
        })
        .join('\n') +
      '\n' +
      `${indent}}`
    );
  }

  return indent + obj.toString();
}

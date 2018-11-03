const makeIndent = (amount: number): string => '  '.repeat(amount);

export default function prettyPrint(obj: any, depth = 0): string {
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
      return `${indent}[Function${obj.name ? `: ${obj.name}` : ''}]`;

    case 'symbol':
      return `${indent}${obj.toString()}`;
  }

  if (obj === null) {
    return `${indent}null`;
  }

  if (Array.isArray(obj)) {
    return `${indent}Array [${obj.map(element => prettyPrint(element, depth + 1)).join(', ')}]`;
  }

  if (obj instanceof Date) {
    return `${indent}Date ${obj.toISOString()}`;
  }

  if (obj instanceof RegExp) {
    return `${indent}${obj.toString()}`;
  }

  if (type === 'object') {
    const keys = Object.keys(obj);
    if (!keys.length) return `${indent}Object {}`;

    return (
      `${indent}Object {` +
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

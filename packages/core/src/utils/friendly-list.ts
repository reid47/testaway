import prettyPrint from './pretty-print';

export default function friendlyList(label: string, values: any[]): string {
  const length = values.length;

  let out = label;
  if (out && length > 1) out += 's';
  if (out) out += ' ';

  values.forEach((value, i) => {
    out += prettyPrint(value);
    if (length > 1) {
      if (i === length - 2) out += ' and ';
      else if (i < length - 2) out += ', ';
    }
  });

  return out;
}

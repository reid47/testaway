import { objectDiff } from './object-diff';
import { stringTypeOf } from './type-of';
import { prettyPrint } from './pretty-print';

export function deepEqual(expected: any, actual: any): { equal: boolean; reasons?: any[] } {
  const diffs = objectDiff(expected, actual);
  if (!diffs.length) return { equal: true };

  const reasons = [];

  if (diffs.length === 1) {
    const { type, actual, expected } = diffs[0];
    if (type === 'wrong-type') {
      reasons.push(
        `but types are different (received ${stringTypeOf(actual)}, but expected ${stringTypeOf(
          expected
        )}).`
      );
    }
  } else if (diffs.every(diff => diff.keyPath.length > 0)) {
    const keyDiffs = diffs
      .map(({ type, keyPath, expected, actual }) => {
        switch (type) {
          case 'extra-key':
            return `unexpected key ${prettyPrint(keyPath.join('.'))}`;
          case 'missing-key':
            return `missing expected key ${prettyPrint(keyPath.join('.'))}`;
          case 'wrong-type':
          case 'wrong-value':
            return `at key ${prettyPrint(keyPath.join('.'))}: received ${prettyPrint(
              actual
            )}, but expected ${prettyPrint(expected)}`;
        }
      })
      .sort()
      .map(line => `    - ${line}`)
      .join('\n');

    reasons.push(`but objects are different:\n${keyDiffs}`);
  }

  if (!reasons.length) {
    reasons.push('but values are different.');
  }

  return { equal: false, reasons };
}

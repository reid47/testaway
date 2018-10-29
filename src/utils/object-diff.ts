import typeOf from './type-of';
import { ValueType, Diff } from '../core/types';

function wrongType(keyPath: string[], expected: any, actual: any): Diff {
  return { type: 'wrong-type', keyPath, expected, actual };
}

function wrongValue(keyPath: string[], expected: any, actual: any): Diff {
  return { type: 'wrong-value', keyPath, expected, actual };
}

function missingKey(keyPath: string[], expected: any, actual: any): Diff {
  return { type: 'missing-key', keyPath, expected, actual };
}

function extraKey(keyPath: string[], expected: any, actual: any): Diff {
  return { type: 'extra-key', keyPath, expected, actual };
}

const hasProp = Object.prototype.hasOwnProperty;

function objectDiffRecursive(expected: any, actual: any, diffs: Diff[], keyPath: string[]) {
  const [expectedType, actualType] = [typeOf(expected), typeOf(actual)];

  if (expectedType !== actualType) {
    diffs.push(wrongType(keyPath, expected, actual));
  } else if (expectedType === ValueType.regexp) {
    if (
      expected.source !== actual.source ||
      expected.global !== actual.global ||
      expected.ignoreCase !== actual.ignoreCase ||
      expected.multiline !== actual.multiline
    ) {
      diffs.push(wrongValue(keyPath, expected, actual));
    }
  } else if (expectedType === ValueType.date) {
    if (expected.getTime() !== actual.getTime()) {
      diffs.push(wrongValue(keyPath, expected, actual));
    }
  } else if (expectedType !== ValueType.object && expectedType !== ValueType.array) {
    if (expected !== actual) {
      diffs.push(wrongValue(keyPath, expected, actual));
    }
  } else {
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);

    for (let i = 0, len = expectedKeys.length; i < len; i++) {
      const expectedKey = expectedKeys[i];
      const nextKeyPath = keyPath.concat(expectedKey);

      if (!hasProp.call(actual, expectedKey)) {
        diffs.push(missingKey(nextKeyPath, expected[expectedKey], actual[expectedKey]));
      } else {
        objectDiffRecursive(expected[expectedKey], actual[expectedKey], diffs, nextKeyPath);
      }
    }

    for (let i = 0, len = actualKeys.length; i < len; i++) {
      const actualKey = actualKeys[i];

      if (!hasProp.call(expected, actualKey)) {
        diffs.push(extraKey(keyPath.concat(actualKey), expected[actualKey], actual[actualKey]));
      }
    }
  }
}

export default function objectDiff(expected: any, actual: any) {
  const diffs: Diff[] = [];
  const keyPath: string[] = [];
  objectDiffRecursive(expected, actual, diffs, keyPath);
  return diffs;
}

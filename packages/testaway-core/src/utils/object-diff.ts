import { typeOf } from './type-of';
import { Diff } from '../types';
import { ANY_PROPERTY } from '../constants';

function createDiff(
  type: 'wrong-type' | 'wrong-value' | 'missing-key' | 'extra-key',
  keyPath: string[],
  expected: any,
  actual: any
): Diff {
  return { type, keyPath, expected, actual };
}

const hasProp = Object.prototype.hasOwnProperty;

function objectDiffRecursive(expected: any, actual: any, diffs: Diff[], keyPath: string[]) {
  if (expected && expected[ANY_PROPERTY]) {
    if (!expected.matches(actual)) {
      diffs.push(createDiff('wrong-value', keyPath, expected, actual));
    }
    return;
  }

  const [expectedType, actualType] = [typeOf(expected), typeOf(actual)];

  if (expectedType !== actualType) {
    diffs.push(createDiff('wrong-type', keyPath, expected, actual));
  } else if (expectedType === 'RegExp') {
    if (
      expected.source !== actual.source ||
      expected.global !== actual.global ||
      expected.ignoreCase !== actual.ignoreCase ||
      expected.multiline !== actual.multiline
    ) {
      diffs.push(createDiff('wrong-value', keyPath, expected, actual));
    }
  } else if (expectedType === 'Date') {
    if (expected.getTime() !== actual.getTime()) {
      diffs.push(createDiff('wrong-value', keyPath, expected, actual));
    }
  } else if (expectedType !== 'object' && expectedType !== 'array') {
    if (expected !== actual) {
      diffs.push(createDiff('wrong-value', keyPath, expected, actual));
    }
  } else {
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);

    for (let i = 0, len = expectedKeys.length; i < len; i++) {
      const expectedKey = expectedKeys[i];
      const nextKeyPath = keyPath.concat(expectedKey);

      if (!hasProp.call(actual, expectedKey)) {
        diffs.push(
          createDiff('missing-key', nextKeyPath, expected[expectedKey], actual[expectedKey])
        );
      } else {
        objectDiffRecursive(expected[expectedKey], actual[expectedKey], diffs, nextKeyPath);
      }
    }

    for (let i = 0, len = actualKeys.length; i < len; i++) {
      const actualKey = actualKeys[i];

      if (!hasProp.call(expected, actualKey)) {
        diffs.push(
          createDiff('extra-key', keyPath.concat(actualKey), expected[actualKey], actual[actualKey])
        );
      }
    }
  }
}

export function objectDiff(expected: any, actual: any) {
  const diffs: Diff[] = [];
  const keyPath: string[] = [];
  objectDiffRecursive(expected, actual, diffs, keyPath);
  return diffs;
}

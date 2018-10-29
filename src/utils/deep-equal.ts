import typeOf from './type-of';
import addArticle from './add-article';
import friendlyList from './friendly-list';
import { ValueType } from '../core/types';
import objectDiff from './object-diff';

export default function deepEqual(expected: any, actual: any): { equal: boolean; reason: string } {
  const diffs = objectDiff(expected, actual);

  if (!diffs.length) return { equal: true, reason: '' };

  // const [typeExpected, typeActual] = [typeOf(expected), typeOf(actual)];
  // if (typeExpected !== typeActual) {
  //   return {
  //     equal,
  //     reason: `Values have different types: received ${addArticle(
  //       typeActual
  //     )}, but expected ${addArticle(typeExpected)}.`
  //   };
  // }

  // if (typeExpected === 'date') {
  //   return {
  //     equal,
  //     reason: `Dates have different values: received ${actual.toString()}, but expected ${expected.toString()}.`
  //   };
  // }

  // if (typeExpected === 'regexp') {
  //   return {
  //     equal,
  //     reason: `Regular expressions have different values: received ${actual.toString()}, but expected ${expected.toString()}.`
  //   };
  // }

  // if (typeExpected === 'object') {
  //   const missingKeys: string[] = [];
  //   const extraKeys: string[] = [];

  //   Object.keys(actual).forEach(key => {
  //     if (!expected.hasOwnProperty(key)) extraKeys.push(key);
  //   });

  //   Object.keys(expected).forEach(key => {
  //     if (!actual.hasOwnProperty(key)) missingKeys.push(key);
  //   });

  //   let reason = '';
  //   if (missingKeys.length && extraKeys.length) {
  //     reason += `Expected object has ${friendlyList('extra key', extraKeys)} and is ${friendlyList(
  //       'missing key',
  //       missingKeys
  //     )}.`;
  //   } else if (missingKeys.length) {
  //     reason += `Expected object is ${friendlyList('missing key', missingKeys)}.`;
  //   } else if (extraKeys.length) {
  //     reason += `Expected object has ${friendlyList('extra key', extraKeys)}.`;
  //   }

  //   return {
  //     equal,
  //     reason
  //   };
  // }

  // TODO: more friendly messages here
  return { equal: false, reason: 'Values are not equal.' };
}

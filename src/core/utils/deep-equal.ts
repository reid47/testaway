import objectDiff from './object-diff';

export default function deepEqual(expected: any, actual: any): { equal: boolean; reason: string } {
  const diffs = objectDiff(expected, actual);

  if (!diffs.length) return { equal: true, reason: '' };

  // TODO: more friendly messages here
  return { equal: false, reason: 'Values are not equal.' };
}

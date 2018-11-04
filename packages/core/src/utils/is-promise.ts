export function isPromise(obj: any) {
  return typeof obj === 'object' && typeof obj.then === 'function';
}

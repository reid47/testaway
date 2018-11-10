export const debug = (...args: any[]) => {
  if (process.env.DEBUG) {
    console.log('[DEBUG]', ...args);
  }
};

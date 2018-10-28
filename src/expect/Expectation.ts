function fail(matcherName: string, expected: any) {
  throw new Error('Expected ' + this.actual + ' ' + matcherName + ' ' + expected);
}

export class Expectation {
  private actual: any;
  private negated: boolean;

  constructor(actual: any) {
    this.actual = actual;
    this.negated = false;
  }

  get not() {
    this.negated = !this.negated;
    return this;
  }

  toBe(expected: any) {
    const objectIs = Object.is(this.actual, expected);
    if (!this.negated && objectIs) return;
    if (this.negated && !objectIs) return;

    fail.call(this, 'toBe', expected);
  }

  // toThrow() {
  //   try {
  //     this.actual();
  //     if (!this.negated) fail.call(this, 'toThrow', 'throw');
  //   } catch {
  //     // NOT WORKING
  //     if (this.negated) fail.call(this, 'toThrow', 'throw');
  //   }
  // }
}

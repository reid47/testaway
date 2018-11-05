export class Mock {
  name: string = '';
  calls: any[] = [];
  context: any = null;
  numberedCallHandlers: any = {};
  defaultCallHandler: any = (): any => void 0;

  static create() {
    const instance = new Mock();

    function MockFunction(...args: any[]) {
      return instance.callMock(...args);
    }

    MockFunction.mock = instance;
    return MockFunction;
  }

  get callCount() {
    return this.calls.length;
  }

  named(name: string) {
    this.name = name;
    return this;
  }

  callMock(...args: any[]) {
    const callNumber = this.calls.length;
    this.calls.push(args);

    const numberedCallHandler = this.numberedCallHandlers['' + callNumber];
    if (numberedCallHandler) return numberedCallHandler(...args);

    return this.defaultCallHandler(...args);
  }

  onCall(index: number) {
    this.context = { callNumber: index };
    return this;
  }

  returns(returnValue: any) {
    if (this.context) {
      if ('callNumber' in this.context) {
        this.numberedCallHandlers['' + this.context.callNumber] = () => returnValue;
      }

      this.context = null;
      return this;
    }

    this.defaultCallHandler = () => returnValue;
    return this;
  }

  // resolvesTo(resolvedValue: any) {
  //   this.defaultReturnValue = Promise.resolve(resolvedValue);
  // }

  // rejectsWith(rejectedValue: any) {
  //   this.defaultReturnValue = Promise.resolve(rejectedValue);
  // }

  resetCalls() {
    this.calls = [];
  }
}

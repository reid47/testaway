import { deepEqual } from './utils/deep-equal';

const initialCallHandler = () => void 0;

export class Mock {
  name?: string;
  calls: any[] = [];
  context: any = null;
  defaultCallHandler: any = initialCallHandler;
  callHandlers: {
    callNumber?: number;
    callArgs?: any[];
    handler: Function;
  }[] = [];

  get called() {
    return this.calls.length > 0;
  }

  get callCount() {
    return this.calls.length;
  }

  get lastCall() {
    return this.calls[this.calls.length - 1];
  }

  constructor(name?: string, setup?: Function) {
    this.name = name;
    if (setup) setup(this);
  }

  addHandler(handler: Function) {
    if (this.context) {
      if ('callNumber' in this.context) {
        const { callNumber } = this.context;
        this.callHandlers.push({ callNumber, handler });
      } else if ('callArgs' in this.context) {
        const { callArgs } = this.context;
        this.callHandlers.push({ callArgs, handler });
      }

      this.context = null;
      return;
    }

    this.defaultCallHandler = handler;
  }

  callMock(...args: any[]) {
    const currentCallNumber = this.calls.length;
    this.calls.push({ args });

    for (const callHandler of this.callHandlers) {
      const { callNumber, callArgs, handler } = callHandler;
      if (currentCallNumber === callNumber) return handler(...args);
      const { equal } = deepEqual(callArgs, args);
      if (equal) return handler(...args);
    }

    return this.defaultCallHandler(...args);
  }

  onArgs(...args: any[]) {
    this.context = { callArgs: args };
    return this;
  }

  onCall(index: number) {
    this.context = { callNumber: index };
    return this;
  }

  returns(returnValue: any) {
    this.addHandler(() => returnValue);
  }

  throws(throwValue: any) {
    this.addHandler(() => {
      throw throwValue;
    });
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

  reset() {
    this.resetCalls();
    this.callHandlers = [];
    this.defaultCallHandler = initialCallHandler;
  }
}

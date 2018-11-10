import { deepEqual } from './utils/deep-equal';

const initialCallHandler = () => void 0;

export class Mock {
  name?: string;
  calls: any[] = [];
  context: any = null;
  argsCallHandlers: { callArgs: any[]; returnValue?: any; throwValue?: any }[] = [];
  numberedCallHandlers: any = {};
  defaultCallHandler: any = initialCallHandler;

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

  callMock(...args: any[]) {
    const callNumber = this.calls.length;
    this.calls.push({ args });

    const numberedCallHandler = this.numberedCallHandlers['' + callNumber];
    if (numberedCallHandler) return numberedCallHandler(...args);

    for (const argsCallHandler of this.argsCallHandlers) {
      const { callArgs, throwValue, returnValue } = argsCallHandler;
      const { equal } = deepEqual(callArgs, args);
      if (equal) {
        if (throwValue) throw throwValue;
        return returnValue;
      }
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
    if (this.context) {
      if ('callNumber' in this.context) {
        const { callNumber } = this.context;
        this.numberedCallHandlers[`${callNumber}`] = () => returnValue;
      } else if ('callArgs' in this.context) {
        const { callArgs } = this.context;
        this.argsCallHandlers.push({ callArgs, returnValue });
      }

      this.context = null;
      return;
    }

    this.defaultCallHandler = () => returnValue;
  }

  throws(throwValue: any) {
    if (this.context) {
      if ('callNumber' in this.context) {
        const { callNumber } = this.context;
        this.numberedCallHandlers[`${callNumber}`] = () => {
          throw throwValue;
        };
      } else if ('callArgs' in this.context) {
        const { callArgs } = this.context;
        this.argsCallHandlers.push({ callArgs, throwValue });
      }

      this.context = null;
      return;
    }

    this.defaultCallHandler = () => {
      throw throwValue;
    };
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
    this.numberedCallHandlers = {};
    this.argsCallHandlers = [];
    this.defaultCallHandler = initialCallHandler;
  }
}

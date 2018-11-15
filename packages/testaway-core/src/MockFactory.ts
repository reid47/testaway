import { Mock } from './Mock';
import { isFunction, isString } from './utils/is';

export class MockFactory {
  static func(nameOrSetupFunc?: string | Function, setupFunc?: Function) {
    const name = isString(nameOrSetupFunc) ? nameOrSetupFunc : void 0;
    const setup = isFunction(nameOrSetupFunc) ? nameOrSetupFunc : setupFunc;
    const instance = new Mock(name, setup);

    function MockFunction(...args: any[]) {
      return instance.callMock(...args);
    }

    MockFunction.mock = instance;
    MockFunction.toString = () => `[MockFunction${name ? ` ${name}` : ''}]`;

    return MockFunction;
  }

  static wrap(nameOrFunc?: string | Function, func?: Function) {
    const name = isString(nameOrFunc) ? nameOrFunc : void 0;
    const implementationFunc = isFunction(nameOrFunc) ? nameOrFunc : func;

    if (!isFunction(implementationFunc)) {
      throw new TypeError('mock.wrap() must be given an implementation function to wrap.');
    }

    return MockFactory.func(name, (_: Mock) => _.runs(implementationFunc));
  }
}

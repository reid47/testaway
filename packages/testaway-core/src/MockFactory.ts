import { Mock } from './Mock';

export class MockFactory {
  static func(nameOrSetupFunc?: string | Function, setupFunc?: Function) {
    const name = typeof nameOrSetupFunc === 'string' ? nameOrSetupFunc : void 0;
    const setup = typeof nameOrSetupFunc === 'function' ? nameOrSetupFunc : setupFunc;
    const instance = new Mock(name, setup);

    function MockFunction(...args: any[]) {
      return instance.callMock(...args);
    }

    MockFunction.mock = instance;
    MockFunction.toString = () => `[MockFunction${name ? ` ${name}` : ''}]`;

    return MockFunction;
  }

  static wrap(nameOrFunc?: string | Function, func?: Function) {
    const name = typeof nameOrFunc === 'string' ? nameOrFunc : void 0;
    const implementationFunc = typeof nameOrFunc === 'function' ? nameOrFunc : func;

    if (typeof implementationFunc !== 'function') {
      throw new TypeError('mock.wrap() must be given an implementation function to wrap.');
    }

    return MockFactory.func(name, (_: Mock) => _.runs(implementationFunc));
  }
}

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
}

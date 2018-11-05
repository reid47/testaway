import * as JsDom from 'jsdom';

export class JsDomTestRunner {
  async init() {}

  async cleanup() {}

  async runFile(fileName: string) {
    const jsdom = new JsDom.JSDOM();
    // jsdom.runVMScript();
  }
}

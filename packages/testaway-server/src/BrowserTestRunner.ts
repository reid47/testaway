import * as puppeteer from 'puppeteer-core';

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export class BrowserTestRunner {
  browser?: puppeteer.Browser;
  options: any;

  constructor(options: any) {
    this.options = options;
  }

  async init() {
    if (this.browser) return;
    this.browser = await puppeteer.launch({
      // headless: false,
      executablePath
    });
  }

  async cleanup() {
    if (!this.browser) return;
    await this.browser.close();
    this.browser = undefined;
  }

  async analyzeFile(fileName: string) {
    await this.init();
    if (!this.browser) return;
    const page = await this.browser.newPage();
    // TODO: how to close this page when analysis is done?
    await page.goto(`http://localhost:${this.options.port}/analyze/${fileName}`);
  }

  async runFile(fileName: string) {
    await this.init();
    if (!this.browser) return;
    const page = await this.browser.newPage();
    // TODO: how to close this page when tests are done?
    await page.goto(`http://localhost:${this.options.port}/run/${fileName}`);
  }
}

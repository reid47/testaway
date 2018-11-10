const { JSDOM } = require('jsdom');
const { expectErrorMessage } = require('./test-helpers');
const originalDocument = global.document;

describe('expect DOM', () => {
  beforeEach(() => {
    const jsDom = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = jsDom.window.document;
  });

  afterEach(() => {
    global.document = originalDocument;
  });

  test('toExist', () => {});

  test('toHaveAttribute', () => {});

  test('toHaveClass', () => {
    document.body.innerHTML = `
      <div id="hello-world">
        <button id="btn-id" class="btn test-btn">click me</button>
      </div>
    `;

    const buttonElement = document.getElementById('btn-id');
    expect(buttonElement).toHaveClass('btn');
    expect(buttonElement).toHaveClass('test-btn btn');
    expect(buttonElement).toHaveClass(['btn', 'test-btn']);
    expect(buttonElement).toHaveClass('  test-btn   btn  ');

    expectErrorMessage(
      () => expect(47).toHaveClass('something'),
      'Expectation failed: expect(received).toHaveClass(expected)',
      '',
      'Expected:',
      '  47',
      'to be a DOM node with class:',
      '  "something"',
      'but it was not a DOM node.',
      ''
    );

    expectErrorMessage(
      () => expect(buttonElement).toHaveClass('something'),
      'Expectation failed: expect(received).toHaveClass(expected)',
      '',
      'Expected:',
      '  <button id="btn-id" class="btn test-btn">click me</button>',
      'to have class:',
      '  "something"',
      'but actual classes were:',
      '  "btn test-btn"',
      ''
    );

    expectErrorMessage(
      () => expect(buttonElement).toHaveClass('something else'),
      'Expectation failed: expect(received).toHaveClass(expected)',
      '',
      'Expected:',
      '  <button id="btn-id" class="btn test-btn">click me</button>',
      'to have classes:',
      '  "something else"',
      'but actual classes were:',
      '  "btn test-btn"',
      ''
    );
  });

  test('not toHaveClass', () => {
    document.body.innerHTML = `
      <div id="hello-world">
        <button id="btn-id" class="btn test-btn">click me</button>
      </div>
    `;

    const buttonElement = document.getElementById('btn-id');
    expect(buttonElement).not.toHaveClass('wow');
    expect(buttonElement).not.toHaveClass('test-wow wow');
    expect(buttonElement).not.toHaveClass(['wow', 'test-wow']);
    expect(buttonElement).not.toHaveClass('  test-wow   wow  ');

    // expectErrorMessage(
    //   () => expect(47).not.toHaveClass('something'),
    //   'Expectation failed: expect(received).not.toHaveClass(expected)',
    //   '',
    //   '  Expected:',
    //   '    47',
    //   '  to be a DOM node without class:',
    //   '    "something"',
    //   '  but it was not a DOM node.',
    //   ''
    // );

    expectErrorMessage(
      () => expect(buttonElement).not.toHaveClass('btn'),
      'Expectation failed: expect(received).not.toHaveClass(expected)',
      '',
      'Expected:',
      '  <button id="btn-id" class="btn test-btn">click me</button>',
      'not to have class:',
      '  "btn"',
      'but actual classes were:',
      '  "btn test-btn"',
      ''
    );

    expectErrorMessage(
      () => expect(buttonElement).not.toHaveClass('test-btn btn'),
      'Expectation failed: expect(received).not.toHaveClass(expected)',
      '',
      'Expected:',
      '  <button id="btn-id" class="btn test-btn">click me</button>',
      'not to have classes:',
      '  "test-btn btn"',
      'but actual classes were:',
      '  "btn test-btn"',
      ''
    );
  });

  test('toHaveText', () => {});

  test('toHaveValue', () => {});
});

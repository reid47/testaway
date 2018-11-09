const createRun = require('../dist/index.min');

describe('test metadata', () => {
  let run;

  beforeEach(() => {
    run = createRun({ reporters: [] });
  });

  test('tests have unique ids', async () => {
    run.test('A', () => {});
    run.test('B', () => {});
    run.test('B', () => {});
    run.test('B', () => {});
    run.suite('1', () => {
      run.test('A', () => {});
      run.test('B', () => {});
    });
    run.suite('1', () => {
      run.test('A', () => {});
      run.test('B', () => {});
    });
    run.test('1>>A', () => {});

    const result = run.analyze();
    expect(result.tests[0].id).toEqual('A');
    expect(result.tests[1].id).toEqual('B');
    expect(result.tests[2].id).toEqual('B_');
    expect(result.tests[3].id).toEqual('B__');
    expect(result.tests[4].id).toEqual('1>>A__');
    expect(result.suites[0].tests[0].id).toEqual('1>>A');
    expect(result.suites[0].tests[1].id).toEqual('1>>B');
    expect(result.suites[1].tests[0].id).toEqual('1>>A_');
    expect(result.suites[1].tests[1].id).toEqual('1>>B_');
  });
});

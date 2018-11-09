const createRun = require('../dist/index.min');

fdescribe('test metadata', () => {
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

  test('tests have names', async () => {
    run.test('A', () => {});
    run.test('B', () => {});
    run.test('B', () => {});
    run.suite('1', () => {
      run.test('A', () => {});
      run.test('B', () => {});
    });
    run.suite('2', () => {
      run.test('A', () => {});
      run.suite('3', () => {
        run.test('A', () => {});
      });
    });
    run.test('1>>A', () => {});

    const result = run.analyze();
    expect(result.tests[0].name).toEqual(['A']);
    expect(result.tests[1].name).toEqual(['B']);
    expect(result.tests[2].name).toEqual(['B']);
    expect(result.tests[3].name).toEqual(['1>>A']);
    expect(result.suites[0].tests[0].name).toEqual(['1', 'A']);
    expect(result.suites[0].tests[1].name).toEqual(['1', 'B']);
    expect(result.suites[1].tests[0].name).toEqual(['2', 'A']);
    expect(result.suites[1].suites[0].tests[0].name).toEqual(['2', '3', 'A']);
  });

  test('suites have names', async () => {
    run.test('A', () => {});
    run.test('B', () => {});
    run.test('B', () => {});
    run.suite('1', () => {
      run.test('A', () => {});
      run.test('B', () => {});
    });
    run.suite('2', () => {
      run.test('A', () => {});
      run.suite('3', () => {
        run.test('A', () => {});
      });
    });
    run.test('1>>A', () => {});

    const result = run.analyze();
    expect(result.suites[0].name).toEqual(['1']);
    expect(result.suites[1].name).toEqual(['2']);
    expect(result.suites[1].suites[0].name).toEqual(['2', '3']);
  });
});

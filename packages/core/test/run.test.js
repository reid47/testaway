const createRun = require('../dist/index.min');

fdescribe('running tests', () => {
  let logs, run;

  beforeEach(() => {
    logs = [];
    run = createRun({ reporters: [] });
  });

  test('basic tests', async () => {
    run.test('A', () => logs.push('test A'));
    run.test('B', () => logs.push('test B'));
    await run.execute();

    expect(logs).toEqual(['test A', 'test B']);
  });

  test('test vs. it', async () => {
    run.test('A', () => logs.push('test A'));
    run.it('B', () => logs.push('test B'));
    run.test('C', () => logs.push('test C'));
    await run.execute();

    expect(logs).toEqual(['test A', 'test B', 'test C']);
  });

  test('focused tests', async () => {
    run.test('A', () => logs.push('test A'));
    run.ftest('B', () => logs.push('test B'));
    run.it('C', () => logs.push('test C'));
    run.fit('D', () => logs.push('test D'));
    await run.execute();

    expect(logs).toEqual(['test B', 'test D']);
  });

  test('skipped tests', async () => {
    run.test('A', () => logs.push('test A'));
    run.xtest('B', () => logs.push('test B'));
    run.it('C', () => logs.push('test C'));
    run.xit('D', () => logs.push('test D'));
    await run.execute();

    expect(logs).toEqual(['test A', 'test C']);
  });

  test('suite vs. describe', async () => {
    run.describe('Suite A', () => {
      run.it('A', () => logs.push('test A'));
      run.describe('Suite A1', () => {
        run.it('A1', () => logs.push('test A1'));
      });
    });

    run.suite('Suite B', () => {
      run.it('B', () => logs.push('test B'));
      run.suite('Suite B1', () => {
        run.it('B1', () => logs.push('test B1'));
      });
    });

    await run.execute();

    expect(logs).toEqual(['test A', 'test A1', 'test B', 'test B1']);
  });

  test('focused suites', async () => {
    run.fdescribe('Suite A', () => {
      run.it('A', () => logs.push('test A'));
    });

    run.describe('Suite B', () => {
      run.it('B', () => logs.push('test B'));
    });

    run.fdescribe('Suite C', () => {
      run.it('C', () => logs.push('test C'));
    });

    await run.execute();

    expect(logs).toEqual(['test A', 'test C']);
  });

  test('skipped suites', async () => {
    run.describe('Suite A', () => {
      run.it('A', () => logs.push('test A'));
    });

    run.xdescribe('Suite B', () => {
      run.it('B', () => logs.push('test B'));
    });

    run.describe('Suite C', () => {
      run.it('C', () => logs.push('test C'));
    });

    await run.execute();

    expect(logs).toEqual(['test A', 'test C']);
  });

  test('focused suites + tests', async () => {
    run.fdescribe('Suite A', () => {
      run.it('A', () => logs.push('test A'));
    });
    run.it('B', () => logs.push('test B'));
    run.it('C', () => logs.push('test C'));
    await run.execute();

    expect(logs).toEqual(['test A']);
  });

  test('tests with hooks', async () => {
    run.describe('SuiteA', () => {
      run.beforeAll(() => logs.push('beforeAll'));
      run.beforeEach(() => logs.push('beforeEach'));
      run.afterEach(() => logs.push('afterEach'));
      run.afterAll(() => logs.push('afterAll'));

      run.test('A', () => logs.push('test A'));
      run.it('B', () => logs.push('test B'));
    });
    await run.execute();

    expect(logs).toEqual([
      'beforeAll',
      'beforeEach',
      'test A',
      'afterEach',
      'beforeEach',
      'test B',
      'afterEach',
      'afterAll'
    ]);
  });

  test('tests with hooks in nested suites', async () => {
    run.describe('Suite A', () => {
      run.beforeAll(() => logs.push('beforeAll A'));
      run.beforeEach(() => logs.push('beforeEach A'));
      run.afterEach(() => logs.push('afterEach A'));
      run.afterAll(() => logs.push('afterAll A'));

      run.test('A', () => logs.push('test A'));

      run.describe('Suite B', () => {
        run.beforeAll(() => logs.push('beforeAll B'));
        run.beforeEach(() => logs.push('beforeEach B'));
        run.afterEach(() => logs.push('afterEach B'));
        run.afterAll(() => logs.push('afterAll B'));

        run.test('B', () => logs.push('test B'));
      });
    });
    await run.execute();

    expect(logs).toEqual([
      'beforeAll A',
      'beforeEach A',
      'test A',
      'afterEach A',
      'beforeEach A',
      'beforeAll B',
      'beforeEach B',
      'test B',
      'afterEach B',
      'afterAll B',
      'afterEach A',
      'afterAll A'
    ]);
  });

  test('focused tests with hooks', async () => {
    run.describe('SuiteA', () => {
      run.beforeAll(() => logs.push('beforeAll'));
      run.beforeEach(() => logs.push('beforeEach'));
      run.afterEach(() => logs.push('afterEach'));
      run.afterAll(() => logs.push('afterAll'));

      run.test('A', () => logs.push('test A'));
      run.ftest('B', () => logs.push('test B'));
      run.it('C', () => logs.push('test C'));
      run.fit('D', () => logs.push('test D'));
    });
    await run.execute();

    expect(logs).toEqual([
      'beforeAll',
      'beforeEach',
      'test B',
      'afterEach',
      'beforeEach',
      'test D',
      'afterEach',
      'afterAll'
    ]);
  });
});

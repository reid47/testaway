const createTestRun = require('../dist/core').default;
const assert = require('assert');

(async function itRunsWhenExecuted() {
  const { it, execute } = createTestRun();

  let ran = false;
  it('basic test definition', () => {
    ran = true;
    assert(47 === 47);
  });

  assert(ran === false, 'should not run before execute is called');
  await execute();
  assert(ran === true, 'should run after execute is called');
})();

(async function itRunsOnceForEachIt() {
  const { it, execute } = createTestRun();
  const runs = [];

  it('run 1/3', () => runs.push(1));
  it('run 2/3', () => runs.push(2));
  it('run 3/3', () => runs.push(3));
  await execute();

  assert(runs.length === 3, `should have run 3 times, actually ${runs.length}`);
})();

(async function itHandlesErrorsInTests() {
  const { it, execute } = createTestRun();

  it('fails', () => {
    throw new Error('whoops');
  });

  await execute();
})();

(async function itWorksWithAsyncTests() {
  const { it, execute } = createTestRun();

  const runs = [];

  it('async test 1 (async/await)', async () => {
    assert(true);
    runs.push(1);
  });

  it('async test 2 (returning a Promise)', () => {
    return new Promise(resolve => {
      assert(true);
      runs.push(2);
      resolve();
    });
  });

  it('async test 2 (done callback)', done => {
    setTimeout(() => {
      runs.push(3);
      done();
    }, 1);
  });

  await execute();
  assert(runs.length === 3, `should have run 3 times, actually ${runs.length}`);
})();

(async function beforeEachAndAfterEach() {
  const { beforeEach, afterEach, it, execute } = createTestRun();

  const logs = [];

  beforeEach(() => {
    logs.push('before1');
  });

  beforeEach(() => {
    logs.push('before2');
  });

  it('test 1', () => {
    logs.push(1);
  });

  it('test 2', () => {
    logs.push(2);
  });

  afterEach(() => {
    logs.push('after1');
  });

  await execute();
  assert(logs.length === 8, `should have run 8 times, actually ${logs.length}`);
  assert(logs[0] === 'before1');
  assert(logs[1] === 'before2');
  assert(logs[2] === 1);
  assert(logs[3] === 'after1');
  assert(logs[4] === 'before1');
  assert(logs[5] === 'before2');
  assert(logs[6] === 2);
  assert(logs[7] === 'after1');
})();

(async function describeWorks() {
  const { describe, it, execute } = createTestRun();

  const runs = [];

  describe('A', () => {
    it('A1', () => {
      runs.push('A1');
    });

    it('A2', () => {
      runs.push('A2');
    });

    describe('B', () => {
      it('B1', () => {
        runs.push('B1');
      });

      it('B2', () => {
        runs.push('B2');
      });
    });

    it('A3', () => {
      runs.push('A3');
    });
  });

  await execute();

  assert(runs.length === 5, `should have run 5 times, actually ${runs.length}`);
  assert(runs[0] === 'A1');
  assert(runs[1] === 'A2');
  assert(runs[2] === 'A3');
  assert(runs[3] === 'B1');
  assert(runs[4] === 'B2');
})();

(async function beforeAllAndAfterAll() {
  const { beforeAll, afterAll, it, execute } = createTestRun();

  const logs = [];

  beforeAll(() => {
    logs.push('before1');
  });

  beforeAll(() => {
    logs.push('before2');
  });

  it('test 1', () => {
    logs.push(1);
  });

  it('test 2', () => {
    logs.push(2);
  });

  afterAll(() => {
    logs.push('after1');
  });

  await execute();
  assert(logs.length === 5, `should have run 5 times, actually ${logs.length}`);
  assert(logs[0] === 'before1');
  assert(logs[1] === 'before2');
  assert(logs[2] === 1);
  assert(logs[3] === 2);
  assert(logs[4] === 'after1');
})();

const createTestRun = require('../../dist/core').default;
const assert = require('assert');

const keepAlive = setTimeout(() => {}, 10000);

(async function asyncTimeout() {
  const { it, execute } = createTestRun();

  let ran = false;
  it('async timeout (callback)', done => {
    console.log('nice');
    ran = true;
    // done();
  });

  await execute();

  clearTimeout(keepAlive);
  console.log('finished');
})();

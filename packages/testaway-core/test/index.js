const testApi = require('../dist/index.min')();

Object.assign(global, testApi);

require('./metadata.test');
require('./run.test');
require('./expect.test');
require('./expect.async.test');
require('./expect.dom.test');
require('./expect.extend.test');
require('./mock.test');

execute();

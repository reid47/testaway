const testApi = require('../dist/index.min')();

Object.assign(global, testApi);

require('./any.test');
require('./expect.async.test');
require('./expect.dom.test');
require('./expect.extend.test');
require('./expect.mocks.test');
require('./expect.test');
require('./metadata.test');
require('./mock.test');
require('./run.test');

execute();

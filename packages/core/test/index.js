const testApi = require('../dist').default();

Object.assign(global, testApi);

require('./expect.test');
require('./expect.async.test');
require('./expect.dom.test');
require('./expect.extend.test');

execute();

import TestServer from './TestServer';

const options = {
  port: 3000,
  rootDir: '/Users/reid/Code/testudo',
  testFilePattern: '<rootDir>/notes/**/*.test.js'
};

TestServer.create(options).start();

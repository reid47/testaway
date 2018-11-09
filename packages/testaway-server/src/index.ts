import { TestServer } from './TestServer';

const options = {
  port: 4700,
  rootDir: '/Users/reid/Code/testaway',
  testFilePattern: '<rootDir>/notes/**/*.test.js'
};

TestServer.create(options).start();

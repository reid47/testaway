import { Expectation } from './Expectation';
import { MockFactory } from './MockFactory';
import { Any } from './Any';

export interface Testaway {
  analyze: () => SuiteDefinition;
  execute: () => void;
  expect: (obj: any) => Expectation;
  any: {
    (ctor: Function): Any;
    arrayContaining: (elements: any[]) => Any;
    empty: () => Any;
    falsy: () => Any;
    satisfying: (predicate: Function) => Any;
    stringContaining: (substring: String) => Any;
    stringMatching: (match: String | RegExp) => Any;
    truthy: () => Any;
  };
  beforeEach: (func: TestFunc) => void;
  afterEach: (func: TestFunc) => void;
  beforeAll: (func: TestFunc) => void;
  afterAll: (func: TestFunc) => void;
  describe: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  fdescribe: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  xdescribe: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  suite: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  fsuite: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  xsuite: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  it: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  fit: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  xit: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  test: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  ftest: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  xtest: (name: string, funcOrOptions: TestFunc | TestOptions, func: TestFunc) => void;
  SimpleReporter: new () => Reporter;
  mock: new () => MockFactory;
}

export type DoneCallback = (err?: Error | string) => void;

export type TestFunc = (doneCallback?: DoneCallback) => Promise<void> | void;

export type SuiteFunc = () => void;

export interface TestRunOptions {
  reporters?: Reporter[];
  timeout?: number;
}

export interface SuiteOptions {
  timeout?: number;
}

export interface TestOptions {
  timeout?: number;
}

export const enum Hook {
  beforeEach,
  afterEach,
  beforeAll,
  afterAll
}

export const enum TestCategory {
  default,
  focused,
  skipped
}

export const enum TestEvent {
  runStarted,
  suiteStarted,
  testStarted,
  testFinished,
  suiteFinished,
  runFinished
}

export const enum ValueType {
  null,
  undefined,
  boolean,
  number,
  string,
  function,
  regexp,
  date,
  array,
  object
}

export type TestStatus = 'passed' | 'failed' | 'skipped';

export interface TestDefinition {
  id: string;
  name: string[];
  category: TestCategory;
}

export interface SuiteDefinition {
  name: string[];
  tests: TestDefinition[];
  suites: SuiteDefinition[];
}

export interface RunDefinedEvent {
  root: SuiteDefinition;
}

export interface RunStartedEvent {
  testCount: number;
}

export interface RunFinishedEvent {
  time: number;
}

export interface SuiteStartedEvent {
  suiteName: string[];
}

export interface SuiteFinishedEvent {
  suiteName: string[];
  time: number;
}

export interface TestStartedEvent {
  testId: string;
  testName: string[];
}

export interface TestFinishedEvent {
  testId: string;
  testName: string[];
  status: TestStatus;
  time: number;
  error?: string;
}

export interface Reporter {
  runDefined?: (event: RunDefinedEvent) => void;
  runStarted?: (event: RunStartedEvent) => void;
  runFinished?: (event: RunFinishedEvent) => void;
  suiteStarted?: (event: SuiteStartedEvent) => void;
  suiteFinished?: (event: SuiteFinishedEvent) => void;
  testStarted?: (event: TestStartedEvent) => void;
  testFinished?: (event: TestFinishedEvent) => void;
}

export interface Diff {
  type: 'wrong-type' | 'wrong-value' | 'missing-key' | 'extra-key';
  keyPath: string[];
  expected: any;
  actual: any;
}

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
  testName: string[];
}

export interface TestFinishedEvent {
  testName: string[];
  status: TestStatus;
  time: number;
  error?: Error;
}

export interface Reporter {
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

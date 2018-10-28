export type DoneCallback = (err?: Error | string) => void;

export type TestFunc = (doneCallback?: DoneCallback) => Promise<void> | void;

export type SuiteFunc = () => void;

export const enum Hook {
  beforeEach,
  afterEach,
  beforeAll,
  afterAll
}

export const enum TestEvent {
  runStarted,
  suiteStarted,
  testStarted,
  testFinished,
  suiteFinished,
  runFinished
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

export interface Options {
  reporters?: Reporter[];
}

export interface MergedOptions {
  reporters: Reporter[];
}

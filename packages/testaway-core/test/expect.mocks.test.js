const { expectErrorMessage } = require('./test-helpers');

test('expect toHaveBeenCalled', () => {
  const called = mock.func();
  called();
  expect(called).toHaveBeenCalled();

  const notCalled = mock.func();
  expectErrorMessage(
    () => expect(notCalled).toHaveBeenCalled(),
    'Expectation failed: expect(received).toHaveBeenCalled()',
    '',
    'Expected:',
    '  [MockFunction]',
    'to have been called at least once.',
    ''
  );

  const notAMock = () => {};
  expectErrorMessage(
    () => expect(notAMock).toHaveBeenCalled(),
    'Expectation failed: expect(received).toHaveBeenCalled()',
    '',
    'Expected:',
    '  [Function: notAMock]',
    'to be a mock function.',
    '',
    'toHaveBeenCalled can only be used with mock functions.',
    ''
  );
});

test('expect not toHaveBeenCalled', () => {
  const notCalled = mock.func();
  expect(notCalled).not.toHaveBeenCalled();

  const called = mock.func();
  called();
  called();
  expectErrorMessage(
    () => expect(called).not.toHaveBeenCalled(),
    'Expectation failed: expect(received).not.toHaveBeenCalled()',
    '',
    'Expected:',
    '  [MockFunction]',
    'not to have been called.',
    ''
  );

  const notAMock = () => {};
  expectErrorMessage(
    () => expect(notAMock).not.toHaveBeenCalled(),
    'Expectation failed: expect(received).not.toHaveBeenCalled()',
    '',
    'Expected:',
    '  [Function: notAMock]',
    'to be a mock function.',
    '',
    'toHaveBeenCalled can only be used with mock functions.',
    ''
  );
});

test('expect toHaveBeenCalledTimes', () => {
  const called = mock.func();
  called();
  expect(called).toHaveBeenCalledTimes(1);

  const notCalled = mock.func();
  expectErrorMessage(
    () => expect(notCalled).toHaveBeenCalledTimes(2),
    'Expectation failed: expect(received).toHaveBeenCalledTimes(count)',
    '',
    'Expected:',
    '  [MockFunction]',
    'to have been called:',
    '  2 times',
    'but it was never called.',
    ''
  );

  const notCalledEnough = mock.func();
  notCalledEnough();
  notCalledEnough();
  expectErrorMessage(
    () => expect(notCalledEnough).toHaveBeenCalledTimes(100),
    'Expectation failed: expect(received).toHaveBeenCalledTimes(count)',
    '',
    'Expected:',
    '  [MockFunction]',
    'to have been called:',
    '  100 times',
    'but it was called:',
    '  2 times',
    ''
  );

  expectErrorMessage(
    () => expect(notCalledEnough).toHaveBeenCalledTimes(1),
    'Expectation failed: expect(received).toHaveBeenCalledTimes(count)',
    '',
    'Expected:',
    '  [MockFunction]',
    'to have been called:',
    '  1 time',
    'but it was called:',
    '  2 times',
    ''
  );

  const notAMock = () => {};
  expectErrorMessage(
    () => expect(notAMock).toHaveBeenCalledTimes(100),
    'Expectation failed: expect(received).toHaveBeenCalledTimes(count)',
    '',
    'Expected:',
    '  [Function: notAMock]',
    'to be a mock function.',
    '',
    'toHaveBeenCalledTimes can only be used with mock functions.',
    ''
  );
});

test('expect not toHaveBeenCalledTimes', () => {
  const notCalled = mock.func();
  expect(notCalled).not.toHaveBeenCalledTimes(100);

  const called = mock.func();
  called();
  called();
  expectErrorMessage(
    () => expect(called).not.toHaveBeenCalledTimes(2),
    'Expectation failed: expect(received).not.toHaveBeenCalledTimes(count)',
    '',
    'Expected:',
    '  [MockFunction]',
    'not to have been called:',
    '  2 times',
    ''
  );

  const notAMock = () => {};
  expectErrorMessage(
    () => expect(notAMock).not.toHaveBeenCalledTimes(),
    'Expectation failed: expect(received).not.toHaveBeenCalledTimes(count)',
    '',
    'Expected:',
    '  [Function: notAMock]',
    'to be a mock function.',
    '',
    'toHaveBeenCalledTimes can only be used with mock functions.',
    ''
  );
});

test('expect toHaveBeenCalledWith', () => {
  const called = mock.func();
  called(1, 2, 'hello');
  expect(called).toHaveBeenCalledWith(1, 2, 'hello');

  const called2 = mock.func();
  called2(1);
  called2(2);
  called2(3);
  called2(4);
  expect(called2).toHaveBeenCalledWith(3);

  const notCalled = mock.func();
  expectErrorMessage(
    () => expect(notCalled).toHaveBeenCalledWith(2),
    'Expectation failed: expect(received).toHaveBeenCalledWith(...args)',
    '',
    'Expected:',
    '  [MockFunction]',
    'to have been called with:',
    '  arguments (2)',
    'but it was never called.',
    ''
  );

  const calledIncorrectlyOnce = mock.func();
  calledIncorrectlyOnce('hello', 'world');
  expectErrorMessage(
    () => expect(calledIncorrectlyOnce).toHaveBeenCalledWith(100, true),
    'Expectation failed: expect(received).toHaveBeenCalledWith(...args)',
    '',
    'Expected:',
    '  [MockFunction]',
    'to have been called with:',
    '  arguments (100, true)',
    'but it was called with:',
    '  arguments ("hello", "world")',
    ''
  );

  const calledIncorrectly = mock.func();
  calledIncorrectly('hello', 'world');
  calledIncorrectly(undefined, null);
  expectErrorMessage(
    () => expect(calledIncorrectly).toHaveBeenCalledWith(100, true),
    'Expectation failed: expect(received).toHaveBeenCalledWith(...args)',
    '',
    'Expected:',
    '  [MockFunction]',
    'to have been called with:',
    '  arguments (100, true)',
    'but it was called with:',
    '  call #0: arguments ("hello", "world")',
    '  call #1: arguments (undefined, null)',
    ''
  );

  const notAMock = () => {};
  expectErrorMessage(
    () => expect(notAMock).toHaveBeenCalledWith(100),
    'Expectation failed: expect(received).toHaveBeenCalledWith(...args)',
    '',
    'Expected:',
    '  [Function: notAMock]',
    'to be a mock function.',
    '',
    'toHaveBeenCalledWith can only be used with mock functions.',
    ''
  );
});

test('expect not toHaveBeenCalledWith', () => {
  const notCalled = mock.func();
  expect(notCalled).not.toHaveBeenCalledWith(100);

  const calledWithOtherArgs = mock.func();
  calledWithOtherArgs('hello', 'world');
  expect(calledWithOtherArgs).not.toHaveBeenCalledWith(47);

  const calledWithNothing = mock.func();
  calledWithNothing();
  expectErrorMessage(
    () => expect(calledWithNothing).not.toHaveBeenCalledWith(),
    'Expectation failed: expect(received).not.toHaveBeenCalledWith(...args)',
    '',
    'Expected:',
    '  [MockFunction]',
    'not to have been called with:',
    '  arguments ()',
    ''
  );

  const calledCorrectly = mock.func();
  calledCorrectly(47);
  expectErrorMessage(
    () => expect(calledCorrectly).not.toHaveBeenCalledWith(47),
    'Expectation failed: expect(received).not.toHaveBeenCalledWith(...args)',
    '',
    'Expected:',
    '  [MockFunction]',
    'not to have been called with:',
    '  arguments (47)',
    ''
  );

  const notAMock = () => {};
  expectErrorMessage(
    () => expect(notAMock).not.toHaveBeenCalledWith(),
    'Expectation failed: expect(received).not.toHaveBeenCalledWith(...args)',
    '',
    'Expected:',
    '  [Function: notAMock]',
    'to be a mock function.',
    '',
    'toHaveBeenCalledWith can only be used with mock functions.',
    ''
  );
});

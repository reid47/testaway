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

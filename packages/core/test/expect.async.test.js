const { expectAsyncErrorMessage } = require('./test-helpers');

test('expect resolves toBe', async () => {
  await expect(Promise.resolve(47)).resolves.toBe(47);

  await expectAsyncErrorMessage(
    () => expect(Promise.resolve(47)).resolves.toBe(48),
    'Expectation failed: expect(received).resolves.toBe(expected)',
    '',
    '  Expected:',
    '    47',
    '  to be:',
    '    48'
  );

  await expectAsyncErrorMessage(
    () => expect(Promise.reject(47)).resolves.toBe(47),
    'Expectation failed: expect(received).resolves',
    '',
    '  Expected:',
    '    Promise {}',
    '  to resolve, but it rejected with:',
    '    47'
  );
});

test('expect resolves not toBe', async () => {
  await expect(Promise.resolve(48)).resolves.not.toBe(47);

  await expectAsyncErrorMessage(
    () => expect(Promise.resolve(47)).resolves.not.toBe(47),
    'Expectation failed: expect(received).resolves.not.toBe(expected)',
    '',
    '  Expected:',
    '    47',
    '  not to be:',
    '    47'
  );
});

test('expect rejects toBe', async () => {
  await expect(Promise.reject(47)).rejects.toBe(47);

  await expectAsyncErrorMessage(
    () => expect(Promise.reject(47)).rejects.toBe(48),
    'Expectation failed: expect(received).rejects.toBe(expected)',
    '',
    '  Expected:',
    '    47',
    '  to be:',
    '    48'
  );
});

test('expect rejects not toBe', async () => {
  await expect(Promise.reject(48)).rejects.not.toBe(47);

  await expectAsyncErrorMessage(
    () => expect(Promise.reject(47)).rejects.not.toBe(47),
    'Expectation failed: expect(received).rejects.not.toBe(expected)',
    '',
    '  Expected:',
    '    47',
    '  not to be:',
    '    47'
  );
});

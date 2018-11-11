const { expectErrorMessage } = require('./test-helpers');

fdescribe('any', () => {
  test('any(String)', () => {
    expect('wow').toEqual(any(String));
    expect('').toEqual(any(String));
    expect(47).not.toEqual(any(String));

    expectErrorMessage(
      () => expect(47).toEqual(any(String)),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  47',
      'to equal:',
      '  any String',
      'but values are different.',
      ''
    );
  });

  test('any(Function)', () => {
    expect(() => {}).toEqual(any(Function));
    expect(function() {}).toEqual(any(Function));
    expect(function named() {}).toEqual(any(Function));

    expectErrorMessage(
      () => expect(47).toEqual(any(Function)),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  47',
      'to equal:',
      '  any Function',
      'but values are different.',
      ''
    );
  });

  test('any.arrayContaining', () => {
    expect([1, 2, 3]).toEqual(any.arrayContaining([3]));

    expectErrorMessage(
      () => expect([]).toEqual(any.arrayContaining([1])),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  Array []',
      'to equal:',
      '  any array containing given elements (in any order)',
      'but values are different.',
      ''
    );
  });

  test('any.empty', () => {
    expect('').toEqual(any.empty());
    expect([]).toEqual(any.empty());
    expect({}).toEqual(any.empty());
    expect('nope').not.toEqual(any.empty());
    expect(['nope']).not.toEqual(any.empty());
    expect({ nope: true }).not.toEqual(any.empty());
    expect(47).not.toEqual(any.empty());
    expect(false).not.toEqual(any.empty());

    expectErrorMessage(
      () => expect(true).toEqual(any.empty()),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  true',
      'to equal:',
      '  any empty string, array, or object',
      'but values are different.',
      ''
    );
  });

  test('any.falsy', () => {
    expect('').toEqual(any.falsy());
    expect(false).toEqual(any.falsy());
    expect('test').not.toEqual(any.falsy());
    expect(true).not.toEqual(any.falsy());
    expect({}).not.toEqual(any.falsy());

    expectErrorMessage(
      () => expect(true).toEqual(any.falsy()),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  true',
      'to equal:',
      '  any falsy value',
      'but values are different.',
      ''
    );
  });

  test('any.satisfying', () => {
    expect(47).toEqual(any.satisfying(val => val > 0));
    expect(47).not.toEqual(any.satisfying(val => val < 0));

    expectErrorMessage(
      () => expect(47).toEqual(any.satisfying(val => val === 0)),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  47',
      'to equal:',
      '  any value satisfying given function',
      'but values are different.',
      ''
    );
  });

  test('any.stringContaining', () => {
    expect('wowie').toEqual(any.stringContaining('wow'));
    expect('hello').not.toEqual(any.stringContaining('nope'));
    expect(47).not.toEqual(any.stringContaining('nope'));

    expectErrorMessage(
      () => expect('test').toEqual(any.stringContaining('hi')),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  "test"',
      'to equal:',
      '  any string containing "hi"',
      'but values are different.',
      ''
    );
  });

  test('any.stringMatching', () => {
    expect('wowie').toEqual(any.stringMatching('wow'));
    expect('wowie').toEqual(any.stringMatching(/wow/));
    expect('hello').toEqual(any.stringMatching(/h.llo/));
    expect('hello').not.toEqual(any.stringMatching(/b.llo/));

    expectErrorMessage(
      () => expect('test').toEqual(any.stringMatching('toast')),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  "test"',
      'to equal:',
      '  any string matching "toast"',
      'but values are different.',
      ''
    );

    expectErrorMessage(
      () => expect('test').toEqual(any.stringMatching(/toast/)),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  "test"',
      'to equal:',
      '  any string matching /toast/',
      'but values are different.',
      ''
    );

    expectErrorMessage(
      () => expect('test').toEqual(any.stringMatching(/ast/)),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  "test"',
      'to equal:',
      '  any string matching /ast/',
      'but values are different.',
      ''
    );
  });

  test('any.truthy', () => {
    expect('test').toEqual(any.truthy());
    expect(true).toEqual(any.truthy());
    expect({}).toEqual(any.truthy());
    expect('').not.toEqual(any.truthy());
    expect(false).not.toEqual(any.truthy());

    expectErrorMessage(
      () => expect(false).toEqual(any.truthy()),
      'Expectation failed: expect(received).toEqual(expected)',
      '',
      'Expected:',
      '  false',
      'to equal:',
      '  any truthy value',
      'but values are different.',
      ''
    );
  });
});

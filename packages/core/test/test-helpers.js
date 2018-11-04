const checkError = (error, lines) => {
  if (!error) throw new Error('No error thrown.');

  const actual = error.message;
  const expected = lines.join('\n');

  if (actual !== expected) {
    const err = new Error(
      'Actual error message:\n\n"' +
        actual +
        '"\n\n...does not match expected:\n\n"' +
        expected +
        '"'
    );

    err.stack = '';
    throw err;
  }
};

exports.expectErrorMessage = (func, ...lines) => {
  let error = null;

  try {
    func();
  } catch (caught) {
    error = caught;
  }

  checkError(error, lines);
};

exports.expectAsyncErrorMessage = async (func, ...lines) => {
  let error = null;

  try {
    await func();
  } catch (caught) {
    error = caught;
  }

  checkError(error, lines);
};

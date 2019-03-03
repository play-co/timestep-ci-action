/* global test, expect */

const textUtils = require('../text');

test('trim', () => {
  const input = ' \n  \n  test1  \n test2 \n  \n ';
  const result = '  test1  \n test2 ';

  expect(textUtils.trim(input)).toBe(result);
});

test('indent', () => {
  const input = '  - point 1\n  - point 2';
  const result = '     - point 1\n     - point 2';

  expect(textUtils.indent(input, 3)).toBe(result);
});

test('outdent', () => {
  const input = '     - point 1\n     - point 2\n - point3';
  const result = '  - point 1\n  - point 2\n- point3';

  expect(textUtils.outdent(input, 3)).toBe(result);
});

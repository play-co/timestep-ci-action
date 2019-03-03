/* global test, expect */

const PullRequestBody = require('../PullRequestBody');
const { getSample } = require('./test-utils');

test('parsing pull request body', async () => {
  const requiredBlocks = [
    'features',
    'refactoring',
    'bug fixes',
    'documentation',
    'code style',
    'user experience',
    'tests',
    'chores',
    'no breaking changes',
    'breaking changes'
  ];

  const basicBody = await getSample('pr_body_basic.md');
  const prBody = new PullRequestBody(basicBody);

  expect(Object.keys(prBody.blocks)).toEqual(requiredBlocks);
});

test('clean block description', async () => {
  const basicBody = await getSample('pr_body_empty_lines.md');
  const prBody = new PullRequestBody(basicBody);

  expect(prBody.getBlock('features').description)
    .toBe('  - empty lines around this one');
  expect(prBody.getBlock('no breaking changes').description)
    .toBe('');
});

test('active blocks', async () => {
  const basicBody = await getSample('pr_body_active_blocks.md');
  const prBody = new PullRequestBody(basicBody);

  expect(prBody.getBlock('features').active).toBe(false);
  expect(prBody.getBlock('refactoring').active).toBe(true);
  expect(prBody.getBlock('bug fixes').active).toBe(false);
  expect(prBody.getBlock('documentation').active).toBe(true);
  expect(prBody.getBlock('code style').active).toBe(false);
  expect(prBody.getBlock('user experience').active).toBe(true);
  expect(prBody.getBlock('tests').active).toBe(false);
  expect(prBody.getBlock('chores').active).toBe(true);
  expect(prBody.getBlock('no breaking changes').active).toBe(false);
  expect(prBody.getBlock('breaking changes').active).toBe(true);
});

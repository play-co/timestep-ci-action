/* global test, expect */

const fs = require('fs-extra');
const PullRequestBody = require('../PullRequestBody');
const ChangelogGenerator = require('../ChangelogGenerator');
const { getSample } = require('./test-utils');

test('active blocks', async () => {
  const logs = new ChangelogGenerator();

  logs.addPullRequest(38, new PullRequestBody(
    await getSample('pr_changelog_test1.md')
  ));

  logs.addPullRequest(13, new PullRequestBody(
    await getSample('pr_changelog_test2.md')
  ));

  logs.addPullRequest(42, new PullRequestBody(
    await getSample('pr_changelog_test3.md')
  ));

  const markdown = logs.render({
    version: '2.1.6',
    repositoryURL: 'https://github.com/BlackstormLabs/github-ci-release-action'
  });

  fs.writeFileSync('changelog_test.md', markdown);

  expect(true).toBe(true);
});

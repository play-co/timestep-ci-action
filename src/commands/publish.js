const execa = require('execa');
const path = require('path');
const fs = require('fs-extra');

const publishBranch = process.env.PUBLISH_BRANCH || 'master';
const npmRcData = '//registry.npmjs.org/:_authToken=${NPM_TOKEN}';

module.exports = async (tools) => {
  function runCommand (cmd, args) {
    const subprocess = execa(cmd, args, { cwd: tools.workspace });
    subprocess.stdout.pipe(process.stdout);
    return subprocess;
  }

  const headBranch = tools.context.payload.pull_request.head.ref;
  const baseBranch = tools.context.payload.pull_request.base.ref;

  tools.log('head branch', headBranch);
  tools.log('base branch', baseBranch);

  if (baseBranch !== publishBranch) {
    tools.exit.neutral('no action required for branch ' + baseBranch);
  }

  try {
    const npmRcPath = path.join(tools.workspace, '.npmrc');

    await runCommand('git', ['checkout', publishBranch]);
    await runCommand('git', ['pull']);
    await fs.writeFile(npmRcPath, npmRcData);
    await runCommand('npm', ['ci']);
    await fs.remove(npmRcPath);
    await runCommand('npm', ['run', 'release']);

    tools.exit.success('new version published successfully');
  } catch (error) {
    tools.log.fatal(error);
    tools.exit.failure('publish failed');
  }
};

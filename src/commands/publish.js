const execa = require('execa');

const publishBranch = process.env.PUBLISH_BRANCH || 'master';

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
    await runCommand('git', ['checkout', publishBranch]);
    await runCommand('git', ['pull']);
    await runCommand('npm', ['ci']);
    await runCommand('npm', ['run', 'release']);

    tools.exit.success('new version published successfully');
  } catch (error) {
    tools.log.fatal(error);
    tools.exit.failure('publish failed');
  }
};

const execa = require('execa');

const publishBranch = process.env.PUBLISH_BRANCH || 'master';

module.exports = async (tools) => {
  const headBranch = tools.context.payload.pull_request.head.ref;
  const baseBranch = tools.context.payload.pull_request.base.ref;

  tools.log('head branch', headBranch);
  tools.log('base branch', baseBranch);

  if (baseBranch !== publishBranch) {
    tools.exit.neutral('no action required for branch ' + baseBranch);
  }

  await tools.runInWorkspace('git', ['checkout', publishBranch]);
  await tools.runInWorkspace('git', ['pull']);

  try {
    const subprocess = execa('npm', ['run', 'release'], {
      cwd: tools.workspace
    });

    subprocess.stdout.pipe(process.stdout);

    await subprocess;

    tools.exit.success('new version published successfully');
  } catch (error) {
    tools.log.fatal(error);
    tools.exit.failure('publish failed');
  }
};

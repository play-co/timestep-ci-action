const execa = require('execa');
const { Toolkit } = require('actions-toolkit');

const protectedBranches = (process.env.PROTECTED_BRANCHES || '')
  .split(',')
  .map(branch => branch.trim());

module.exports = async (yargs) => {
  const tools = new Toolkit({
    event: [
      'pull_request.opened',
      'pull_request.edited',
      'pull_request.reopened',
      'pull_request.synchronize'
    ]
  });

  async function createStatus (state, description) {
    return tools.github.repos.createStatus({
      ...tools.context.repo,
      sha: tools.context.sha,
      state,
      description,
      context: process.env.STATUS_CONTEXT
    });
  }

  await createStatus('pending');

  const headRef = tools.context.payload.pull_request.head.ref;
  const baseBranch = tools.context.payload.pull_request.base.ref;

  tools.log('head ref', headRef);
  tools.log('base ref', baseBranch);

  if (protectedBranches.length &&
      !protectedBranches.includes(baseBranch)) {
    await createStatus('success', 'Validation skipped');

    tools.log('protected branches', protectedBranches);
    tools.exit.neutral('skipping validation for unprotected branch');
  }

  const subprocess = execa('npx', [
    'tsci', 'changelog', 'status',
    '--cwd=' + tools.workspace,
    '--auth-token=' + tools.token,
    '--pull-request=' + tools.context.payload.pull_request.number
  ]);

  subprocess.stdout.pipe(process.stdout);

  try {
    await subprocess;
    await createStatus('success', 'Validation successful');

    tools.exit.success('validation successful');
  } catch (error) {
    await createStatus('failure', 'Invalid pull request format');

    tools.log.fatal(error);
    tools.exit.failure('validation failed');
  }
};

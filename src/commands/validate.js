const execa = require('execa');
const { Toolkit } = require('actions-toolkit');

const allowedActions = [
  'opened', 'edited', 'reopened', 'synchronize'
];

const protectedBranches = (process.env.PROTECTED_BRANCHES || '')
  .split(',')
  .map(branch => branch.trim());

module.exports = async (yargs) => {
  const tools = new Toolkit({
    event: ['pull_request']
  });

  const action = tools.context.payload.action;

  tools.log('payload action', action);

  if (!allowedActions.includes(action)) {
    tools.log('skipping unsupported action: ' + action);

    process.exit(0);
  }

  const headRef = tools.context.payload.pull_request.head.ref;
  const baseBranch = tools.context.payload.pull_request.base.ref;

  tools.log('head ref', headRef);
  tools.log('base ref', baseBranch);

  tools.log('protected branches', protectedBranches, protectedBranches.length,
    !protectedBranches.includes(baseBranch));

  if (protectedBranches.length &&
      !protectedBranches.includes(baseBranch)) {
    tools.log('protected branches', protectedBranches);
    tools.log('skipping validation for unprotected branch');

    process.exit(0);
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

    tools.log('pull request validation successful!');

    process.exit(0);
  } catch (error) {
    tools.log('pull request validation error!');
    tools.log('tsci exited with code ' + error.exitCode + ': ' + error.message);

    process.exit(1);
  }
};

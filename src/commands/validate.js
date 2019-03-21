const execa = require('execa');
const { Toolkit } = require('actions-toolkit');

const allowedActions = [
  'opened', 'edited', 'reopened', 'synchronize'
];

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

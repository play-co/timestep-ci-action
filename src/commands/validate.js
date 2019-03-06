const execa = require('execa');
const { Toolkit } = require('actions-toolkit');

module.exports = async (yargs) => {
  const tools = new Toolkit({
    event: ['pull_request']
  });

  tools.log('payload action', tools.context.payload.action);

  const result = await execa('npx', [
    'tsci', 'changelog', 'validate',
    '--cwd=' + tools.workspace,
    '--auth-token=' + tools.token,
    '--pull-request=' + tools.context.payload.pull_request.number,
    '--output=json'
  ]);

  tools.log('tsci validate result', JSON.parse(result.stdout));
};

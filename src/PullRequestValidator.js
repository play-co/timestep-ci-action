const execa = require('execa');

class PullRequestValidator {
  constructor (tools) {
    this.tools = tools;
  }

  async go () {
    const tools = this.tools;
    const result = JSON.parse(await execa('npx', [
      'tsci', 'changelog', 'validate',
      '--cwd=' + tools.workspace,
      '--auth-token=' + tools.token,
      '--pull-request=' + tools.context.payload.pull_request.number,
      '--output=json'
    ]));

    this.tools.log('tsci validate result', result);
  }
}

module.exports = PullRequestValidator;

const { Toolkit } = require('actions-toolkit');

const tools = new Toolkit({
  event: ['pull_request']
});

tools.log('test log');

tools.log('action', tools.context.action);

const PullRequestValidator = require('./PullRequestValidator');

new PullRequestValidator(tools)
  .go()
  .then(result => {
    tools.log.success('Validation result', result);
  });

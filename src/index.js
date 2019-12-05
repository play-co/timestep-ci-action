const { Toolkit } = require('actions-toolkit');

const tools = new Toolkit({
  event: 'pull_request'
});

const payload = tools.context.payload;

async function run () {
  if (['opened', 'edited', 'reopened', 'synchronize'].includes(payload.action)) {
    // Dispatch 'validate' action
    await require('./commands/validate')(tools);
  } else if (payload.action === 'closed' && payload.pull_request.merged) {
    // Dispatch 'publish' action

    // Temporarily disabled!
    // require('./commands/publish')(tools);

    tools.exit.neutral('publishing is temporarily disabled');
  } else {
    tools.log('action: ' + payload.action);
    tools.log('pull_request.merged: ' + payload.pull_request.merged);

    tools.exit.neutral('no action needed');
  }
}

run()
  .then(() => tools.exit.success())
  .catch(err => {
    tools.log(err);
    tools.exit.failure(err.message);
  });

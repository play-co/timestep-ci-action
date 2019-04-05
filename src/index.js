const { Toolkit } = require('actions-toolkit');

const tools = new Toolkit({
  event: 'pull_request'
});

const payload = tools.context.payload;

if (['opened', 'edited', 'reopened', 'synchronize'].includes(payload.action)) {
  // Dispatch 'validate' action
  require('./commands/validate')(tools);
} else if (payload.action === 'closed' && payload.pull_request.merged) {
  // Dispatch 'publish' action
  require('./commands/publish')(tools);
} else {
  tools.log('action: ' + payload.action);
  tools.log('pull_request.merged: ' + payload.pull_request.merged);

  tools.exit.neutral('no action needed');
}

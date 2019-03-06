const yargs = require('yargs');

// eslint-disable-next-line no-unused-expressions
yargs
  .usage('Usage: $0 <command> <operation>')
  .showHelpOnFail(true)
  .help('help', 'Show usage instructions.')

  .command({
    command: 'validate',
    desc: 'Validate incoming pull request',
    handler: require('./commands/validate')
  })

  .demandCommand()
  .strict()
  .argv;

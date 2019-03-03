const { Toolkit } = require('actions-toolkit');
const tools = new Toolkit();

console.log(tools.arguments);

// const IssueCreator = require('.')
// const issueCreator = new IssueCreator(tools)
// issueCreator.go()
//   .then(issue => {
//     tools.log.success(`Created issue ${issue.data.title}#${issue.data.number}: ${issue.data.html_url}`)
//   })

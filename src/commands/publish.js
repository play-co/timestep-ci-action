const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");

const publishBranch = process.env.PUBLISH_BRANCH || "master";
const npmRcTemplate =
  "@play-co:registry=https://npm.pkg.github.com/:_authToken=${NPM_TOKEN}\n" +
  "registry=https://registry.npmjs.org/\n" +
  "unsafe-perm = true";

module.exports = async (tools) => {
  function runCommand(cmd, args) {
    const subprocess = execa(cmd, args, { cwd: tools.workspace });
    subprocess.stdout.pipe(process.stdout);
    return subprocess;
  }

  const headBranch = tools.context.payload.pull_request.head.ref;
  const baseBranch = tools.context.payload.pull_request.base.ref;

  tools.log("head branch", headBranch);
  tools.log("base branch", baseBranch);

  if (baseBranch !== publishBranch) {
    tools.exit.neutral("no action required for branch " + baseBranch);
  }

  try {
    const npmRcPath = path.join(tools.workspace, ".npmrc");

    // Make sure we're on the required branch
    await runCommand("git", ["checkout", publishBranch]);
    await runCommand("git", ["pull"]);

    // Set up npm to use our token
    await fs.writeFile(npmRcPath, npmRcTemplate);

    // Install dependencies
    await runCommand("npm", ["ci"]);

    // Set git credentials
    await runCommand("git", [
      "config",
      "user.email",
      '"timestep-ci@gameclosure.com"',
    ]);
    await runCommand("git", ["config", "user.name", '"Timestep CI"']);

    // Publish new version
    await runCommand("npm", ["run", "release"]);

    tools.exit.success("new version published successfully");
  } catch (error) {
    tools.log.fatal(error);
    tools.exit.failure("publish failed");
  }
};

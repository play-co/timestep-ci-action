# Timestep CI Action

## Environment variables and secrets

- `PROTECTED_BRANCHES`: List of comma-separated branch names. If omitted, validation will run for all branches.
- `GITHUB_TOKEN`: Github API token. Should be provided by the CI.
- `NPM_TOKEN`: NPM token required for private package installation and publishing.


## Commands and arguments

There's no default command, you must explicitly specify command for this action (override `args` parameter).

- `validate`: Performs PR format validation.

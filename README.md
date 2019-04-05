# Timestep CI Action

## Environment variables and secrets

- `PUBLISH_BRANCH`: The only branch to publish new versions from. Default: `master`.
- `PROTECTED_BRANCHES`: List of comma-separated branch names. If omitted, validation will run for all branches.
- `STATUS_CONTEXT`: Github check name used for protecting branches.
- `GITHUB_TOKEN`: Github API token. Should be provided by the CI.
- `NPM_TOKEN`: NPM token required for private package installation and publishing.

# Repo workflow — deltas from the team standard

The team rules come from the **sds-dev** plugin. Only what differs here:

- **Commit format:** prefix with the task ID, `DIMA-751 - <description>` (the plugin default is `<TASK-ID>: <description>`; either is accepted, match recent history).
- **Branch prefixes:** `feature/`, `bugfix/`, `hotfix/` (no `chore/` before DAP-611).
- **PR body:** besides the team sections, a `## Manual steps` section (env var or config changes, or "None").
- **Environments:** `develop` → staging-demo.sdsmanager.com, `rc` → rc-api.sdsmanager.com, tag `prod-v*` → api.sdsmanager.com (see `.github/workflows/deploy.yml`). Branch flow: develop → rc → main.

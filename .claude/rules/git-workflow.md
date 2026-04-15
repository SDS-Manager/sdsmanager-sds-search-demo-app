# Git & PR Workflow

## Branch Naming

- Format: `{prefix}/{clickup-id}` — e.g., `feature/86c9796dr`, `bugfix/86c8xu8p0`, `hotfix/86c90bw7u`
- Prefixes: `feature/`, `bugfix/`, `hotfix/`
- The ClickUp task ID comes from the card URL: `https://app.clickup.com/t/{ID}`
- **Do NOT** use generic names like `feature/fix` or `bugfix/issue` — the ClickUp ID is mandatory.

### Branch naming examples

| Prefix | ClickUp URL | Correct branch name |
|--------|-------------|---------------------|
| `feature/` | `https://app.clickup.com/t/86c91jqtg` | `feature/86c91jqtg` |
| `bugfix/` | `https://app.clickup.com/t/86c9796dr` | `bugfix/86c9796dr` |
| `hotfix/` | `https://app.clickup.com/t/86c90bw7u` | `hotfix/86c90bw7u` |

## Commit Rules

- **1 PR = 1 commit.** If there are 2+ commits, squash with `git rebase -i` before opening the PR.
- Write clear commit messages describing what and why.
- Prefix the commit message with the ClickUp task ID — e.g., `86c9796dr - Fix minimum_revision_date invalid datetime format`.

## Pull Request Rules

- Target branch: `develop` (unless it's a hotfix → `main`)
- PR description **must** include:
  - **ClickUp task ID and full link** — always include both, e.g.:
    `ClickUp: 86c9796dr — https://app.clickup.com/t/86c9796dr`
  - Detailed description of the change (more detail is better)
  - Any manual steps required (env var changes, config updates, etc.)

### PR description template

```
## ClickUp Task
<task-id> — https://app.clickup.com/t/<task-id>

## Description
<Detailed explanation of what changed and why>

## Manual steps
<List any required manual steps, or "None">
```

> The ClickUp task ID is **required** in every PR. Do not open a PR without it.

## Branch Flow

```
develop  →  rc  →  main
(staging)   (RC)   (production)
```

## Environments

| Branch    | Environment | Domain                                  |
|-----------|-------------|------------------------------------------|
| `develop` | Staging     | staging-demo.sdsmanager.com             |
| `rc`      | RC          | rc-api.sdsmanager.com                   |
| `main`    | Production  | api.sdsmanager.com                       |

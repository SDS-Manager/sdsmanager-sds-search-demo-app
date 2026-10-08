# Git & PR Workflow

## Branch Naming

- Format: `{prefix}/{task-id}` — e.g., `feature/DIMA-750`, `bugfix/DIMA-751`, `hotfix/DIMA-752`
- Prefixes: `feature/`, `bugfix/`, `hotfix/`
- The task ID is the Stride ID from the task URL: `https://work.sdsmanager.com/task/{ID}` (e.g. `DIMA-750`). Keep its case as Stride shows it. Branches already opened with a legacy ClickUp ID (`https://app.clickup.com/t/{ID}`) keep it — see [stride-tasks.md → Task IDs](stride-tasks.md#task-ids).
- **Do NOT** use generic names like `feature/fix` or `bugfix/issue` — the task ID is mandatory.

### Branch naming examples

| Prefix | Stride URL | Correct branch name |
|--------|-------------|---------------------|
| `feature/` | `https://work.sdsmanager.com/task/DIMA-750` | `feature/DIMA-750` |
| `bugfix/` | `https://work.sdsmanager.com/task/DIMA-751` | `bugfix/DIMA-751` |
| `hotfix/` | `https://work.sdsmanager.com/task/DIMA-752` | `hotfix/DIMA-752` |

## Commit Rules

- **Multiple commits per PR are fine.** Every PR is merged using GitHub's **Squash and merge**, so all commits on your branch collapse into a single commit on the base branch automatically — no need to `git rebase -i` locally. Write meaningful commit messages; the PR title becomes the squashed commit message.
- Write clear commit messages describing what and why.
- Prefix the commit message with the task ID — e.g., `DIMA-751 - Fix minimum_revision_date invalid datetime format`.

## Pull Request Rules

- Target branch: `develop` (unless it's a hotfix → `main`)
- PR description **must** include:
  - **Stride task ID and full link** — always include both, e.g.:
    `Stride: DIMA-751 — https://work.sdsmanager.com/task/DIMA-751`
    (legacy in-flight work may keep `ClickUp: {id} — https://app.clickup.com/t/{id}`)
  - Detailed description of the change (more detail is better)
  - Any manual steps required (env var changes, config updates, etc.)

### PR description template

```
## Task
Stride: <task-id> — https://work.sdsmanager.com/task/<task-id>

## Description
<Detailed explanation of what changed and why>

## Manual steps
<List any required manual steps, or "None">
```

> The task ID is **required** in every PR. Do not open a PR without it.

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

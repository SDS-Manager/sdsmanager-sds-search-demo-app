# sdsmanager-sds-search-demo-app

FastAPI backend + React/TypeScript frontend demo of the SDS Manager API (SDS search, extraction, summaries). Architecture, endpoints, commands: `.claude/rules/project.md`.

Team rules and skills come from the **sds-dev** plugin (marketplace `sds`,
SDS-Manager/sds-localenv). Trusting this folder offers it via
`.claude/settings.json`; manual install:
`claude plugin marketplace add SDS-Manager/sds-localenv && claude plugin install sds-dev@sds`.
Rules: `/sds-dev:sds-rules-git`, `sds-rules-stride`, `sds-rules-plans`,
`sds-rules-code`, `sds-rules-security`, `sds-rules-session`. Start with `/sds-dev:sds-help`.

## Repo facts
- Repo: SDS-Manager/sdsmanager-sds-search-demo-app
- Stride team: DIMA
- Base branch: develop
- Hotfix base: main
- Branch flow: develop → rc → main (prod via tag `prod-v*`)
- Branch prefixes: feature/, bugfix/, hotfix/
- Plan dir: .claude/plans/
- Test: backend `pytest` from `backend/` (no runner configured); frontend `cd frontend && npm test`
- Lint/format: `pre-commit run --all-files` (backend: black 79, isort, flake8)
- Deploy: CI on push to `develop` and `rc`, and on tag `prod-v*` (.github/workflows/deploy.yml); never by Claude
- PR template: none (repo rule adds `## Manual steps`, see .claude/rules/repo-workflow.md)
- Sibling repos: none
- Repo rules kept: .claude/rules/project.md, repo-workflow.md, code-style.md, fastapi-patterns.md, api-design.md, api-security.md, testing.md, frontend-patterns.md

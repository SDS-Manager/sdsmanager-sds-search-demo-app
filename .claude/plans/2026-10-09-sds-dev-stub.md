# Use the shared sds-dev plugin, thin duplicated Claude rules

Stride: DAP-611 — https://work.sdsmanager.com/task/DAP-611

## Goal
Stop duplicating team Claude rules and skills in this repo. The shared `sds-dev` plugin
(SDS-Manager/sds-localenv, marketplace `sds`) ships them. This repo keeps only its own facts and rules.

## Dependency
Merge only after https://github.com/SDS-Manager/sds-localenv/pull/30 (the plugin) is merged.

## Deleted vs kept
| Action | Path | Why |
|---|---|---|
| Deleted | `.claude/rules/git-workflow.md` | plugin `sds-rules-git` + Repo facts; deltas moved to `repo-workflow.md` |
| Deleted | `.claude/rules/stride-tasks.md` | plugin `sds-rules-stride` |
| Deleted | `.claude/rules/clickup-tasks.md` | plugin `sds-rules-stride` (legacy section) |
| Deleted | `.claude/skills/handover/SKILL.md` | `/sds-dev:sds-handover` |
| Moved | `.claude/CLAUDE.md` project content | `.claude/rules/project.md` (auto-loads) |
| Rewritten | `.claude/CLAUDE.md` | stub + Repo facts |
| Added | `.claude/rules/repo-workflow.md` | commit format, `## Manual steps`, environments |
| Edited | `.claude/settings.json` (new), both agent files | plugin keys; `git-workflow.md` references replaced |
| Kept | `rules/code-style.md`, `fastapi-patterns.md`, `api-design.md`, `api-security.md`, `testing.md`, `frontend-patterns.md`; `agents/fastapi-implementer.md`, `react-implementer.md`; `.claude/plans/`; `.github/workflows/deploy.yml` | repo-specific |

## Open questions
- Backend test command: no runner configured (`testing.md` recommends pytest).
- Commit format `DIMA-751 - ...` differs from the plugin default; recorded in `repo-workflow.md`.

## Design decisions
- CLAUDE.md becomes the stub from the plugin's STUB_TEMPLATE with a filled `## Repo facts`; long project content moved to `.claude/rules/`.
- `.claude/settings.json`: added `extraKnownMarketplaces.sds` and `enabledPlugins["sds-dev@sds"]` with jq; no existing key touched.
- Rejected: deleting repo variants of shared skills and usage hooks (out of scope for this phase).

## Test plan
Open Claude in the repo, trust the folder, accept the sds-dev plugin; check `/sds-dev:sds-help` answers and the core rules show at session start; `grep -A15 '^## Repo facts'` finds the section.

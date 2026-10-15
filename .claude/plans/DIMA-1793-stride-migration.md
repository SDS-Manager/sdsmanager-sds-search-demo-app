# Plan — Add Stride to the Claude setup (ClickUp kept read-only, removed later)

Status: In Progress (Phase 1 done 2026-10-08) · Author: Luan Nguyen · 2026-10-08
Task: DIMA-1793 — https://work.sdsmanager.com/task/DIMA-1793

## Goal

Every Claude workflow that today reads or writes ClickUp works with Stride
(`work.sdsmanager.com`, IDs like `DIMA-750`). Old ClickUp IDs keep working
**read-only**, because Zahir asked that nobody create or update tasks in ClickUp
any more. ClickUp is removed in a later phase.

## Facts verified against Stride (2026-10-08)

- MCP: `https://work.sdsmanager.com/mcp`, tools `mcp__stride__*`, acting as the key owner.
- Our team: **`DIMA` — "Dev Inv Mgr+Admin"** (replaces ClickUp list `901521246467`).
  Primary task page: `https://work.sdsmanager.com/team/DIMA/f/tasks`. Team lists:
  `Dev Inv Mgr+Admin`, `Inv mgr Deployed and low pri tasks` (`create_task` has no list
  argument; `update_task(folder=...)` sets it — `/f/tasks` = list `Dev Inv Mgr+Admin`, the primary list).
- Task URL: `https://work.sdsmanager.com/task/{KEY-N}`.
- Statuses carried over with the same names (`Add new tasks here`, `Ready for test on staging`,
  `Tested ok - ready for rc`, `<date> - deployed`, …).
- Priority is a built-in enum: `urgent | high | medium | low | none`.
- **No custom fields.** RIRE and Module were imported as plain text in the description.
- Labels exist (`db migration`, `affects database`, `Bug`, …).
- No legacy-ID field; `search("<clickup id>")` finds a task only when the old ID is in its text.
- Tools we need: `get_task` (includes thread), `list_comments`, `search`, `find_tasks`,
  `create_task`, `update_task`, `comment`, `get_team`, `list_members`.
  `attach_pr` / `open_pull_request` belong to Stride agent *runs* — not for our skills.

## Decisions (defaults chosen — change any before Phase 1)

| # | Decision | Default |
|---|---|---|
| D1 | Where RIRE + Module live | A fixed text block at the top of the description (same as the import). Labels only for `db migration` / `affects database`. |
| D2 | Priority mapping | P0, P1 → `urgent` · P2 → `high` · P3 → `medium` · P4, P6 → `low` · Not sure → `none` |
| D3 | Branch / commit / plan names | Use the identifier as-is: `feature/DIMA-750`, `DIMA-750: <desc>`, `DIMA-750-short-desc.md` |
| D4 | Which system an ID belongs to | `^[A-Z][A-Z0-9]{1,9}-\d+$` → Stride; anything else → ClickUp (legacy, read-only) |
| D5 | ClickUp writes | Off. Skills never create/comment/update in ClickUp. Legacy IDs: read task + comments only. |
| D6 | Status changes by Claude | None by default (same as today). Only on explicit request, with exact names from `get_team`. |
| D7 | PR body heading | `## Task` with `Stride: DIMA-750 — https://work.sdsmanager.com/task/DIMA-750` |

## Where this plan and the changes live

- Plan copies: workspace `.claude/plans/stride-migration.md` **and** each affected service
  `services/<name>/.claude/plans/DIMA-1793-stride-migration.md`, so a developer working inside
  one repo sees it.
- Workspace repo → commit to `main` (no PR, per the workspace exception).
- Service repos → branch `chore/DIMA-1793`, PR to **`rc`** (decided 2026-10-08). Luan reviews and
  merges them back to `develop` afterwards.

## Phase 0 — Prerequisites

- [x] Stride task created: DIMA-1793 (list `Dev Inv Mgr+Admin`).
- [ ] Rotate the Stride API key that was pasted in chat.
- [ ] Every developer runs `claude mcp add --scope user stride …` with their own key
      (documented in the new rule, Phase 1). Never commit a key.
- [ ] Confirm D1–D7 with Erlend.

## Phase 1 — Workspace root (`/sds/sdsmanager/.claude`, commit to `main`, no PR)

1. **New `rules/stride-tasks.md`** — the single source for task-tracker behaviour:
   connection setup, team `DIMA`, URL, ID regex (D4), tool names, status/label lookup via
   `get_team`, priority map (D2), description template + RIRE/Module block (D1),
   comment formatting, "Resolving a task ID" procedure (Stride vs legacy ClickUp).
2. **`rules/clickup-tasks.md`** — reduce to a "Legacy (read-only)" note: how to read an old
   `86c…` / `1245x…` task; no create/update/comment. Keep custom-field IDs only for history.
3. **`rules/git-workflow.md`** — `{clickup-id}` → `{task-id}`; examples with `DIMA-750`;
   PR template heading (D7); legacy IDs still valid for branches that already exist.
4. **`CLAUDE.md`** — Cross-service conventions, root rule list, plan naming → `{task-id}`.
5. **Skills** (`.claude/skills/`):

   | Skill | Change |
   |---|---|
   | `sds-create-task` | Create in Stride: `create_task(team="DIMA", status="Add new tasks here", priority, labels)`, then place it in the team's task list; RIRE/Module text block; Mode 1 prefix `CLAUDE CODE:` kept. Rename description to "Stride task". |
   | `sds-create-plan` | Mode A: resolve ID (D4) → `get_task` (Stride) or ClickUp read for legacy. Plan header `Task: DIMA-750 — <url>`. |
   | `sds-dev-plan` / `sds-code-review` | Plan lookup with an ID boundary: `-iname "{ID}-*"` (so `DIMA-75` ≠ `DIMA-750`). Branch from `{task-id}`. |
   | `sds-update-task` | Commit `{task-id}: …`; PR body `## Task` (D7); comment via `mcp__stride__comment`. Legacy ID → no ClickUp comment, tell the user. |
   | `sds-pr-review` | Fetch with `get_task` (thread included); scan description + comments for PR links; PR search by branch containing the ID. |
   | `sds-pick-rc` | Read status via `get_task`; status names unchanged; blocked comment via `mcp__stride__comment`. |
   | `sds-help` (+ `references/workflow.md`) | Terminology + plan header format. |

6. **Agents** — `cross-repo-pr-preparer`, `service-router`, `debugger`, `error-detective`:
   `{clickup-id}` → `{task-id}`, "ClickUp task" → "Stride task".

## Phase 2 — Service repos (`.claude/` + `.github/`)

One branch per repo, `chore/DIMA-1793`, PR to `rc`, cross-linked (then back-merge to `develop`).

| Files | Repos | Change |
|---|---|---|
| `rules/clickup-tasks.md` | 10 services | Replace with a short `stride-tasks.md` that points to the root rule; legacy note. |
| `rules/git-workflow.md` | 12 services (+ `sds-release`, `shepherd`) | `{task-id}`, Stride URL, examples. |
| `CLAUDE.md` | 12 services | Rule links + plan naming. |
| `skills/create-pr` | 8 services | Step 2 ID regex (D4); Step 2c fetch via Stride; Step 8 comment via Stride; PR heading (D7). |
| `skills/handover` | 7 services | `Task: <ID + URL>`. |
| `rules/communication-style.md`, `context-management.md` | sdsadmin, sds_inventory_mgr, sds_store | ClickUp formatting quirks → Stride (verify Markdown tables render in Stride comments first). |
| `.github/pull_request_template.md` | sdsadmin, sds_inventory_mgr, sds_store | `## Task` heading + Stride link. |
| `.github/workflows/ai-review.yml` | sdsadmin | "Every PR must link a Stride task (or a legacy ClickUp task)". |

Not touched: `sdsadmin/.claude/rules/migrations.md` (PROTECTED — its `<clickup-id>` wording stays;
the hook blocks edits). `pr-body-check.yml` needs no change (it never parses the ID).

## Phase 3 — `sds-release` code (own plan + PR, tests)

The PR-body parser would record every Stride-linked PR as "missing task".

- `app/services/clickup_id.py`: accept Stride URL `https?://work\.sdsmanager\.com/task/([A-Z][A-Z0-9]{1,9}-\d+)`
  and label `Stride: DIMA-750`; keep ClickUp patterns for legacy PRs. Widen
  `CLICKUP_ID_PATTERN` so `/api/tasks/{id}` accepts `DIMA-750` (still strict: it reaches `git` args).
- Keep the `clickup_id` column/name for now (no Alembic migration); rename to `task_id`
  when ClickUp is removed. Add a `TaskIdSource` value per tracker if needed.
- Settings: `STRIDE_API_URL`, `STRIDE_API_KEY` (service account, not a person's key),
  `STRIDE_TASK_BASE_URL` + `.env.example`.
- Phase 4 preflight status rule → Stride client in `app/clients/`. **Open question for Zahir:**
  is there a REST API, or should a server call the MCP endpoint?
- Tests: parser cases for Stride URL/label, mixed ClickUp+Stride body = ambiguous, path-param validation.

## Phase 4 — Verify end to end

- [ ] `/sds-create-task` → creates a `DIMA-…` task with RIRE block, correct priority/labels.
- [ ] `/sds-create-plan DIMA-…` → plan `DIMA-…-x.md`, header links Stride.
- [ ] `/sds-dev-plan` → branch `feature/DIMA-…` in each affected repo.
- [ ] `/sds-update-task` → PR body has `## Task` + Stride link; Stride comment posted.
- [ ] `/sds-pr-review DIMA-…` and `/sds-pick-rc DIMA-…` read the task and status.
- [ ] A legacy `86c…` ID still resolves read-only and nothing is written to ClickUp.
- [ ] `sds-release` records a Stride-linked merged PR with the right ID.

## Phase 5 — Remove ClickUp (later, after sign-off)

Delete legacy ClickUp branches in skills, `clickup-tasks.md` files, `CLICKUP_*` settings,
rename `clickup_id` → `task_id` in `sds-release` (Alembic revision).

## Out of scope

- `sds-one` — not maintained by the VN team; ignored.
- Angie plugin (`angie-dispatch` etc.) — external plugin, not in our repos.
- The 781 historical plan files and code comments that cite old ClickUp IDs.

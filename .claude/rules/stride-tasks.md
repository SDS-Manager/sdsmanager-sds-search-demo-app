# Stride Task Management

Canonical rules for all SDS Manager services. Since 2026-10-08 every dev task lives in
**Stride** (`work.sdsmanager.com`), not ClickUp. ClickUp is **read-only** for legacy task
IDs — see [clickup-tasks.md](clickup-tasks.md) — and will be removed later.

Use the Stride MCP tools (`mcp__stride__*`). They are deferred — fetch schemas first, e.g.
`ToolSearch("select:mcp__stride__get_task,mcp__stride__comment")`. Everything they change is
recorded under the name of the person whose key is configured.

---

## Connection (once per developer)

Create a personal API key in Stride, then:

```bash
claude mcp add --transport http --scope user stride https://work.sdsmanager.com/mcp \
  --header "Authorization: Bearer <YOUR_STRIDE_KEY>"
```

Restart Claude Code. **Never commit a key** — a repo-level `.mcp.json` must use
`"Authorization": "Bearer ${STRIDE_API_KEY}"`. If `ToolSearch("select:mcp__stride__get_task")`
returns nothing, Stride is not connected: stop and tell the user how to connect it.

---

## Where our tasks live

| | |
|---|---|
| Team | `DIMA` — "Dev Inv Mgr+Admin" |
| Primary list | `Dev Inv Mgr+Admin` — https://work.sdsmanager.com/team/DIMA/f/tasks |
| New-task status | `Add new tasks here` (the team default) |
| Task URL | `https://work.sdsmanager.com/task/{ID}` — e.g. https://work.sdsmanager.com/task/DIMA-750 |

Always use team `DIMA` for SDS Manager dev work; never ask the user which team. Reports about
Stride itself go to team `PH` (Project HubOne) with status `Stride` — not to `DIMA`.

Status and label names must be exact: read them with `get_team(team="DIMA")` before setting
one. The statuses kept their ClickUp names (`Ready for test on staging`,
`Tested ok - ready for rc`, `<date> - deployed`, …).

---

## Task IDs

A Stride ID is `{TEAM KEY}-{number}`: `DIMA-750`, `PH-875`.

**Resolving an ID the user gives you** — the single procedure every skill uses:

1. Strip a URL to its ID (`https://work.sdsmanager.com/task/DIMA-750` → `DIMA-750`).
2. If it matches `^[A-Za-z][A-Za-z0-9]{1,9}-[0-9]+$`, it is a **Stride** ID. Upper-case it
   (`dima-750` → `DIMA-750`) and read it with `get_task(task="DIMA-750")`.
3. Anything else (`86c8xu8p0`, `1245xawbg3d`, `KJtjywtf`) is a **legacy ClickUp** ID:
   - First try `search(query="<id>")` in Stride. Migrated tasks often still quote their old
     ID; if exactly one task matches, show it and ask the user to confirm it is the same task.
     When confirmed, the Stride task is the live copy — read and write there.
   - Otherwise read the ClickUp task **read-only** ([clickup-tasks.md](clickup-tasks.md)).
     Never create, comment on or update it.

The ID is used verbatim in branch names, commit prefixes and plan file names — see
[git-workflow.md](git-workflow.md). Keep the case: `feature/DIMA-750`, not `feature/dima-750`.

---

## Tools

| Need | Tool |
|---|---|
| Read a task (description, properties, comment thread) | `get_task(task)` |
| Read comments only | `list_comments(task)` |
| Find a task by words / old ClickUp ID | `search(query)` |
| Filter tasks (team, status, assignee, label) | `find_tasks(...)` |
| Statuses, labels, members | `get_team(team="DIMA")` |
| Create | `create_task(team, title, description, status, priority, labels, assignee)` |
| Put a task in the primary list | `update_task(task, folder="Dev Inv Mgr+Admin")` — `create_task` has no list argument |
| Change status / priority / labels / assignee | `update_task(task, ...)` — `labels` **replaces** the set |
| Comment | `comment(task, body)` — Markdown; mention as `@[Name](member:<id>)` with the id from `list_members` |

`attach_pr`, `open_pull_request`, `set_plan` and `finish` belong to Stride's own agent *runs* —
our skills do not use them. Link a PR by putting its URL in a comment.

**Writes need the user's confirmation.** Show the draft (title + description, or the comment
text) and wait for an explicit yes before `create_task`, `update_task` or `comment`. Never
change a task's status unless the user asked for that change.

---

## Two task creation modes

**Mode 1 — Post-coding:** documenting work already done by Claude (code written, PR exists).
Skip the interview. Title prefixed `CLAUDE CODE:`. Describe what was done, link the PR(s),
list the files changed.

**Mode 2 — Request-phase:** new work that has not started. Interview first (below). No
`CLAUDE CODE:` prefix.

### Request-phase interview — MANDATORY

Do not create a task from a one-liner. Ask until a stranger could pick it up cold:

- **Problem** — who is affected, what's wrong, the impact
- **Desired outcome** — with examples or user flows
- **Acceptance criteria** — at least 3, testable
- **Scope** — in scope and explicitly out of scope
- **Module** — from the list below
- **RIRE** — Reach, Impact, Revenue, Effort, each 1–5. Ask each; never invent them
- **Priority** — proposed from the RIRE score; the user confirms or overrides

Suggest acceptance criteria from codebase knowledge; the user confirms. If it sounds like
several tasks, suggest splitting. Flag likely schema or dependency changes at the top of the
description with `⚠️ DATABASE CHANGES REQUIRED` / `⚠️ NEW PACKAGES REQUIRED`.

---

## RIRE, Module and Priority

Stride has **no custom fields**. RIRE and Module live in a fixed text block at the top of the
description (the ClickUp import put them there too); priority uses Stride's built-in field.

**Score:** `(Reach × Impact × Revenue) / Effort`, range 0.2–125. Write it with one decimal.

| Score | Proposed priority | Stride `priority` |
|---|---|---|
| ≥ 15 | P1 - BIG DEAL BLOCKED (P0 if a production bug) | `urgent` |
| 8 – under 15 | P2 - CUSTOMER ESCALATION | `high` |
| 3 – under 8 | P3 - NICE VALUE | `medium` |
| 1 – under 3 | P4 - LOW VALUE | `low` |
| under 1 | P6 - IDEA FOR SOMEDAY | `low` |
| — | Not sure | `none` |

P0 - PRODUCTION BUG → `urgent`. "Production bug" or "deal blocked" from the user means P0/P1
regardless of score. Always say: "Based on your RIRE score of X, I'd suggest **PY**. Does that
look right, or would you like to override?"

Mode 1 tasks: RIRE line may be omitted; Module is usually `Other` (tooling) or the product
module; priority usually `none`.

**Modules:** Inventory Manager - Improvements · Inventory Manager - UX · Inventory Manager - New
feature · Inventory Manager - Bugs · APP (progressive web app) · APP (FLUTTER) · Extraction
pipeline · Website & Landing pages · Website Discovery & Search · FAQ · Authoring · SDS Admin -
CRM/MSG · SDS Admin - Harvesting & Quality support tools · SDS Admin - Misc · SDS Admin - SDS
Validation · SDS Distribution · Demo API · NON-CODING TASK · Other

**Labels:** use existing ones only (`get_team`). Add `db migration` when the task needs a schema
change and `Bug` for a defect.

---

## Task title

- Request-phase: action verb, no prefix — `Fix mobile Tasks menu to show submenu instead of auto-navigating`
- Post-coding: `CLAUDE CODE: Add Norwegian translations for dashboard V2`

## Task description template

```markdown
RIRE: Reach <R> · Impact <I> · Revenue <Rev> · Effort <E> → Score <S>
Module: <module>
Priority: <P-level>

## Problem
[Who is affected and what's the issue — include impact/business context]

## Desired Outcome
[What the end result should look like — with specific examples or user flows]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Scope
**In scope:** [specific changes to deliver]
**Out of scope:** [related things NOT part of this task]

## Affected Area
[Frontend / Backend / Full stack / Admin panel / etc.]

## Dependencies & Blockers
[Prerequisites, related tasks, external dependencies — or "None"]

## Edge Cases & Risks
[What could go wrong, performance concerns, permission issues]

## Technical Context
[Relevant endpoints, tables, components, related PRs/tasks — if known]
```

## Creating a task (technical steps)

1. `ToolSearch("select:mcp__stride__create_task,mcp__stride__update_task,mcp__stride__search")`
2. `search(query=...)` to check the work is not already tracked.
3. Preview title + full description + priority + labels; wait for explicit confirmation.
4. `create_task(team="DIMA", status="Add new tasks here", title, description, priority, labels)`
   — add `assignee` only if the user names one (`me`, a name or an email).
5. `update_task(task=<new ID>, folder="Dev Inv Mgr+Admin")` so it lands in the primary list.
6. Return the ID and `https://work.sdsmanager.com/task/<ID>`.

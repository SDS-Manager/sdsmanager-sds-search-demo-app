# ClickUp — Legacy, Read-Only

Task tracking moved to **Stride** on 2026-10-08. All task rules — creating tasks, RIRE,
priority, comments, the description template — are in [stride-tasks.md](stride-tasks.md).

ClickUp is kept **only to read** tasks created before the move. ClickUp will be removed later.

## Rules

- **Never write to ClickUp.** No `clickup_create_task`, `clickup_update_task`,
  `clickup_create_task_comment`, `clickup_move_task` or any other write. Changes made in
  ClickUp may not carry over to Stride.
- A legacy ID is anything that is not a Stride ID (`86c8xu8p0`, `1245xawbg3d`, `KJtjywtf`).
  Resolve it with the procedure in [stride-tasks.md → Task IDs](stride-tasks.md#task-ids):
  look for the migrated Stride task first, and fall back to reading ClickUp.
- Reading is allowed with `mcp__claude_ai_ClickUp__clickup_get_task` and
  `mcp__claude_ai_ClickUp__clickup_get_task_comments` (fetch schemas via ToolSearch). If the
  ClickUp tools are not in the session, say so and continue from the Stride copy, the plan
  file or the PR body.
- Where a skill would have posted to ClickUp, post to the migrated Stride task instead (after
  the user confirms it is the same task), or give the user the text to post themselves.
- Branches, commits and plan files that already carry a legacy ID keep it — do not rename
  in-flight work.

## Legacy references

- Old task URL: `https://app.clickup.com/t/{ID}`
- Old board: SDS Manager Dev Project, list `901521246467` → now Stride team `DIMA`.

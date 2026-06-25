---
name: handover
description: Create a complete session handover document so a new Claude Code session can pick up the work cold. Use when the user wants to hand off to a new session, switch contexts, mentions "handover", "hand off", "new session", or is worried about context size / quality degrading.
---

Create a complete session handover for a new Claude Code session.

The new session must be able to pick up cold — with zero context from this conversation — and continue the work without asking the user any clarifying questions. Err on the side of **too much detail**. This is a knowledge dump, not an executive summary.

## Step 1 — Determine output location

Write the handover to a file outside any git repo, grouped by project:

- **macOS/Linux**: `~/.claude/handovers/<project-name>/session-<YYYY-MM-DD>-<short-topic>.md`
- **Windows**: `%USERPROFILE%\.claude\handovers\<project-name>\session-<YYYY-MM-DD>-<short-topic>.md`

Where:
- `<project-name>` is the last segment of the current working directory (e.g., `sds-git2`, `sdsadmin`, `sds_inventory_mgr`)
- `<YYYY-MM-DD>` is today's date
- `<short-topic>` is a 2–4 word kebab-case summary of the main work (e.g., `dashboard-redesign`, `sds-validation-fix`)

Create the directory if it doesn't exist.

## Step 2 — Gather context before writing

Before writing, do these in parallel:

1. Check for `CLAUDE.md` in the current working directory and any parent repo roots — note conventions the new session must follow.
2. Check for `plans/` directory in active repos — note any plan files relevant to current work.
3. Run `git status` and `git log --oneline -10` in each repo touched this session — capture branch state, unpushed commits.
4. Check the workspace memory dir (usually under `~/.claude/projects/<workspace-key>/memory/`) — list filenames the new session should read.
5. Review the conversation for: user corrections, decisions made, files edited, commands run, errors encountered, workarounds discovered.

## Step 3 — Write the handover file

Use this exact structure. Do not skip sections — write "None" or "N/A" if a section doesn't apply, but include the heading.

```markdown
# Session Handover — <topic>

**Date**: <YYYY-MM-DD>
**Previous session working directory**: <absolute path>
**Project**: <project name>

## TL;DR

- <3–5 bullets: what we were doing, where we are now, what to do next>

## Goal & Scope

**Original request**: <user's original ask, verbatim if short>

**In scope**:
- <...>

**Out of scope** (explicitly excluded):
- <...>

**References**:
- ClickUp: <task ID + URL, or "None">
- GitHub issue: <url or "None">
- PR: <url or "None">

## Current State

**Completed**:
- <...>

**In progress** (partial work — be explicit about where it stops):
- <...>

**Not started**:
- <...>

## Files Touched

Grouped by repo. Use clickable markdown links with line numbers where relevant.

### <repo-1>
- [path/to/file.ts](absolute/path/to/file.ts) — <what changed and why>
- [path/to/other.py:42](absolute/path/to/other.py:42) — <what changed and why>

### <repo-2>
- ...

## Branches & PRs

| Repo | Branch | Base | Commits ahead | Pushed? | PR URL |
|------|--------|------|---------------|---------|--------|
| ... | ... | ... | ... | ... | ... |

**Force-push history**: <any force-pushes done this session, or "None">

## Key Decisions & Tradeoffs

For each major decision:
- **Decision**: <what we chose>
- **Alternatives considered**: <what we rejected>
- **Why**: <rationale>

## User Corrections & Feedback

Things the user corrected or pushed back on during this session. **The new session must not re-litigate these.**

- <correction 1 — quote the user's words if short>
- <correction 2>

## Environment & Running Services

- **Frontend**: <port, container/npm, running or stopped>
- **Backend**: <containers running, which ports>
- **Database**: <migrations applied this session, seed data added>
- **Config/env changes**: <any .env edits, docker-compose modifications>
- **Do NOT revert**: <files with local modifications that must be preserved>

## Verification Status

**Tested and working**:
- <...>

**Not yet tested**:
- <...>

**Known failing / broken**:
- <what's broken, why, error message>

**Commands to re-run tests**:
\`\`\`bash
<exact commands>
\`\`\`

## Blockers & Open Questions

- <things waiting on the user>
- <ambiguous requirements>
- <external dependencies>

## Next Steps (ordered, concrete)

1. <specific action — "Edit X to do Y", not "continue work">
2. <...>
3. <...>

## Gotchas & Non-obvious Context

Things that took multiple tries, workarounds discovered, pitfalls:

- <...>

## References

- **CLAUDE.md**: <path, if present>
- **LOCAL_DEV_SETUP.md**: <path, if relevant>
- **Plan files**: <paths in plans/ directories>
- **Memory files to read**: <filenames from the memory dir>
- **Related docs**: <...>

## Kickoff Prompt

Paste this into the new session:

> I'm resuming work from a previous Claude Code session. Read the handover at `<absolute path to this file>` and then give me a one-paragraph summary of where we are and what the next concrete action is. Do not start working yet — wait for my go-ahead.
```

## Step 4 — Print output to chat

After writing the file, output to chat:

1. The **absolute path** to the handover file
2. The **kickoff prompt** (copy-pasteable, single line)

Nothing else. No summary of the handover itself — the user can read the file.

## Rules

- **Do not summarize, do not be brief** inside the handover file itself.
- Quote exact error messages, command output, file paths.
- If a plan file in `plans/` is relevant, update it too and reference it in the handover.
- If you touched a repo, capture its git state (`git status` + `git log --oneline -5` output) in the handover.
- If the session had explicit user corrections, those go in the "User Corrections & Feedback" section verbatim — this is the single most important section for avoiding repeat mistakes.
- The kickoff prompt must tell the new session to **wait for user go-ahead** before acting. The user should always confirm the summary before work resumes.

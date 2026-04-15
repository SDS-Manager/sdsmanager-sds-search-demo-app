# ClickUp Task Management

When creating ClickUp tasks (e.g., to track work, bugs, or features), use the MCP ClickUp integration tools. These are deferred tools with the prefix `mcp__claude_ai_ClickUp__`. You MUST fetch their schemas via ToolSearch before calling them (e.g., `ToolSearch("select:mcp__claude_ai_ClickUp__clickup_create_task")`).

**NOTE**: The ClickUp MCP tools are only available when running Claude Code through the **VS Code extension** (they are provided by the Claude.ai managed MCP integration). If these tools are not in your deferred tools list, you are likely running outside VS Code — inform the user that ClickUp task creation requires a VS Code Claude Code session.

---

## Two Task Creation Modes

**Mode 1 — Post-coding task (skip interview):** When a task is created to document work already done by Claude (code written, PR exists), skip the RIRE scoring, interview process, and acceptance criteria. Just create the task with a clear description of what was done, link to the PR, and files changed. Prefix title with `CLAUDE CODE:` and set status to `ADD NEW TASKS HERE`.

**Mode 2 — Request-phase task (full process):** When someone is requesting NEW work that hasn't started yet, follow the full process below. This is the default. Do NOT prefix the title with `CLAUDE CODE:` — that prefix is only for tasks documenting Claude-written code.

---

## Request-Phase Task Creation Process — MANDATORY

Before creating a request-phase development task:

1. **Read `CLICKUP_TASK_GUIDELINES.md`** to understand the required fields and quality standards.
2. **Interview the user** — do NOT create the task from a one-liner. Ask clarifying questions until you have at minimum:
   - **Problem statement**: Who is affected, what's the issue, what's the impact
   - **Desired outcome**: What the end result should look like, with examples
   - **Acceptance criteria**: At least 3 specific, testable criteria
   - **Scope**: What is in scope AND what is explicitly out of scope
   - **Affected area**: Frontend / Backend / Full stack / etc.
   - **Module**: Which module from the ClickUp dropdown (see custom fields below)
   - **RIRE ratings**: Reach (1–5), Impact (1–5), Revenue (1–5), Effort (1–5)
   - **Priority**: Auto-proposed by Claude based on RIRE score (see mapping below), user confirms or overrides
3. **Flag database/package changes** — if the task will likely need new DB columns or new packages, call this out prominently at the top of the description.
4. **Show the user a preview** of the task (title + full description) and get confirmation before creating it.
5. **Create the task** using the structured format below.

---

## Interviewing Rules

- If the user gives a vague request like "fix the upload page" or "add validation", do NOT proceed. Ask: what specifically is broken? which fields need validation? what are the rules?
- Keep asking until a stranger could pick up the task and understand what to build.
- Suggest acceptance criteria based on what you know about the codebase — the user can confirm or adjust.
- If the user mentions something that sounds like multiple tasks, suggest splitting them.
- For bugs: always ask for steps to reproduce, expected vs actual behavior, and frequency.

---

## Task Title Convention

- **Request-phase tasks**: Do NOT prefix with `CLAUDE CODE:`. Use concise action verbs (Add, Fix, Update, Remove, Implement, Refactor). Keep under 80 characters.
  - Bad: `SDS thing` / Good: `Fix upload endpoint to reject non-PDF files`
- **Post-coding tasks** (documenting Claude-written code with a PR): Prefix with `CLAUDE CODE:`.
  - Example: `CLAUDE CODE: Add language versions tab to demo app`

---

## RIRE Scoring

Ask the user to rate each dimension on a scale of **1–5**:

| Dimension | 1 (Low) | 3 (Medium) | 5 (High) |
|-----------|---------|------------|----------|
| **Reach** | Handful of users | A segment of users | All or most users |
| **Impact** | Minor convenience | Noticeable improvement | Critical blocker or major UX gain |
| **Revenue** | No revenue impact | Indirect (retention, efficiency) | Direct (new sales, churn prevention) |
| **Effort** | Quick fix (hours) | Moderate (days) | Major effort (weeks+) |

**Formula:** `RIRE Score = (Reach × Impact × Revenue) / Effort` (auto-calculated by ClickUp)

---

## Priority Auto-Proposal

After collecting RIRE ratings, calculate the score and **propose** a priority. The user confirms or overrides.

| RIRE Score | Proposed Priority |
|------------|-------------------|
| 15–25 | **P1 - BIG DEAL BLOCKED** (or P0 if production is down) |
| 8–15 | **P2 - CUSTOMER ESCALATION** |
| 3–8 | **P3 - NICE VALUE** |
| 1–3 | **P4 - LOW VALUE** |
| < 1 | **P6 - IDEA FOR SOMEDAY** |

Always show the user: "Based on your RIRE score of X, I'd suggest **PY**. Does that look right, or would you like to override?"

Override when needed: a low-RIRE bug may still be P0 if production is down; a high-RIRE idea may be P6 if there's no capacity.

---

## Task Description Format

Use `markdown_description` with this structure (include the RIRE table at the top):

```markdown
## RIRE Score
| Reach | Impact | Revenue | Effort | **Score** |
|-------|--------|---------|--------|-----------|
| <R>   | <I>    | <R>     | <E>    | **auto**  |

**Module:** <module name>

## Problem
[Who is affected and what's the issue — include impact/business context]

## Desired Outcome
[What the end result should look like — with specific examples or user flows]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
- [ ] ...

## Scope
**In scope:** [specific changes to deliver]
**Out of scope:** [related things NOT part of this task]

## Affected Area
[Frontend / Backend / Full stack / etc.]

## Dependencies & Blockers
[Prerequisites, related tasks, external dependencies — or "None"]

## Edge Cases & Risks
[What could go wrong, performance concerns, auth issues]

## Technical Context
[Relevant endpoints, schemas, components, related PRs/tasks — if known]
```

---

## Task Types — What to Emphasise

### Bug Reports
Emphasise: steps to reproduce, expected vs actual behavior, browser/environment, screenshots, frequency (always/sometimes/once), severity (data loss? cosmetic? blocking?).

### New Features
Emphasise: problem statement, user story, acceptance criteria, scope boundaries, mockups or endpoint shape.

### Improvements / Enhancements
Emphasise: current behavior, why it's insufficient, desired behavior, backward compatibility.

### Technical Debt / Refactoring
Emphasise: what's wrong with the current implementation, risks of not fixing, proposed approach, how to verify nothing breaks.

---

## What Makes a BAD Task

- "Fix the SDS page" — which page? what's broken? for whom?
- "Make it faster" — what is slow? how fast should it be?
- "Add validation" — for which fields? what rules? what error messages?
- No acceptance criteria — nobody knows when it's done
- Mixing multiple unrelated changes in one task

## What Makes a GOOD Task

- A stranger could pick it up and understand what to build
- Acceptance criteria are specific and testable
- Scope is clear — you know what NOT to build
- Priority is set with reasoning
- Dependencies are flagged upfront

---

## How to Create a Task (Technical Steps)

**Board:** [SDS Manager Dev Project](https://app.clickup.com/90152360809/v/b/6-901521246467-2)

1. **Fetch the tool schema first**: `ToolSearch("select:mcp__claude_ai_ClickUp__clickup_create_task")`
2. **Always use list `901521246467`** (SDS Manager Dev Project). Do not ask the user which list.
3. Use `mcp__claude_ai_ClickUp__clickup_create_task` with:
   - `name`: task title
   - `list_id`: `"901521246467"`
   - `status`: `"ADD NEW TASKS HERE"` — always, so tasks land in the triage column
   - `markdown_description`: full structured description per the format above
   - `assignees`: use `mcp__claude_ai_ClickUp__clickup_resolve_assignees` to convert emails to IDs if needed
   - `custom_fields`: **MUST** include RIRE scores, Module, and Priority:

     ```json
     "custom_fields": [
       {"id": "aa90401a-2d94-43dc-8ea2-23846be9aabb", "value": <Reach 1-5>},
       {"id": "54644afa-57f9-407c-bf80-72f4dbdf9a3c", "value": <Impact 1-5>},
       {"id": "28eaa87d-c80a-4199-a20e-80d3ad247d6e", "value": <Revenue 1-5>},
       {"id": "de12716d-c559-4844-9f75-9d2266006dac", "value": <Effort 1-5>},
       {"id": "7f5e3124-85dc-4afe-a416-48b2a2071ba6", "value": "<Module option ID>"},
       {"id": "0fc2af06-ebc8-472c-84f3-8e1aece6396d", "value": "<Priority option ID>"}
     ]
     ```

4. The **SCORE (RIRE)** field (`04cd210c-b0f3-464f-90c5-1ff10aaf9898`) is a formula field — do NOT set it manually.

---

## Module Option IDs

Default module for this project: **Demo API** (`86d86efa-8591-4290-837a-9b4d03b47c0a`)

| Module | Option ID |
|--------|-----------|
| Demo API | `86d86efa-8591-4290-837a-9b4d03b47c0a` |
| Inventory Manager - Improvements | `d5fc41c5-27b6-42fd-9df8-181b85d04dd6` |
| Inventory Manager - UX | `2d69e691-8e9f-4107-bbf5-8cfd8168c4ce` |
| Inventory Manager - New feature | `15cbb1ac-6b04-42e4-998e-81f9ada5b7d5` |
| Inventory Manager - Bugs | `9e2b95ae-43bf-4eb4-832f-ecae11f57b2a` |
| APP (progressive web app) | `de881275-dc4e-4e06-a19b-75f1ac126362` |
| APP (FLUTTER) | `6ad14751-0108-455e-9463-9384e9547aa7` |
| Extraction pipeline | `fb592eeb-8ec7-4474-82a7-561a946df893` |
| Website & Landing pages | `72624edd-9b17-4328-98b8-fc64b8591a94` |
| Website Discovery & Search | `e8a48dd1-8bd9-43ef-94fd-ca73b786564b` |
| FAQ | `54e0a4f2-38d7-4207-ae03-9da454844c69` |
| Authoring | `62666ed0-0a12-45a6-98c1-9b83de7281cc` |
| SDS Admin - CRM/MSG | `be6b294a-a344-4068-a110-e4f76c430242` |
| SDS Admin - Harvesting & Quality support tools | `72774641-c51d-4374-852f-981ec7f549a8` |
| SDS Admin - Misc | `4e2d1ecc-5c63-459b-9580-995da72395cf` |
| SDS Admin - SDS Validation | `55c03d32-87c2-4730-9e65-a447100e9e44` |
| SDS Distribution | `fa77e261-c6e7-490e-b00a-54714e28febf` |
| NON-CODING TASK | `e35aa861-e9e0-4f48-b694-323c2f991bb0` |
| Other | `12806006-ee36-4cbd-ac59-f2de82e69d4a` |

---

## Priority Option IDs

| Priority | When to Use | Option ID |
|----------|-------------|-----------|
| P0 - PRODUCTION BUG | Production is broken, data loss, revenue impact now | `bac03c54-e4a9-4f55-8f94-210f6cbdd263` |
| P1 - BIG DEAL BLOCKED | A sales deal or key customer is blocked | `13b43a02-b610-45a9-897e-90c5c23b8933` |
| P2 - CUSTOMER ESCALATION | Customer complaint or escalation | `33b40e79-7c31-426e-b189-9a5b7aa080de` |
| P3 - NICE VALUE | Good value, no urgency | `15ffa755-7103-4859-ac32-7d34ad2c0dd6` |
| P4 - LOW VALUE | Nice to have, backlog | `ba2cedc3-fb1b-4d65-8677-98bb096e61ca` |
| P6 - IDEA FOR SOMEDAY | Future idea, no commitment | `d79cb980-fdbb-44bf-919f-4f9525316f9c` |
| Not sure | Let the team triage | `00a7852d-165f-4377-8a07-c4841e112fa4` |

---

## Other Useful ClickUp Tools

All prefixed with `mcp__claude_ai_ClickUp__` — fetch schema via ToolSearch before calling:

- `clickup_search` — find existing tasks
- `clickup_update_task` — update status, assignees, fields
- `clickup_create_task_comment` — add a comment to an existing task
- `clickup_get_task` — get full task details

# Stride Task Guidelines — SDS Manager Dev Project

**Team:** `DIMA` — Dev Inv Mgr+Admin
**List:** [Dev Inv Mgr+Admin](https://work.sdsmanager.com/team/DIMA/f/tasks)
**Default status for new tasks:** `Add new tasks here`
**Task URL:** `https://work.sdsmanager.com/task/{ID}` — e.g. [DIMA-750](https://work.sdsmanager.com/task/DIMA-750)

Since 2026-10-08 all development tasks for SDS Manager live in **Stride** (`work.sdsmanager.com`).
ClickUp is read-only for old tasks and will be removed later — do not create or update tasks there.
Tasks created via Claude Code land in the list above with status `Add new tasks here` for triage.

The rules Claude follows are in [`.claude/rules/stride-tasks.md`](.claude/rules/stride-tasks.md);
this page is the same process written for the people requesting the work.

## When Does This Apply?

This guideline applies to **request-phase tasks** — new work that hasn't started yet. This is the full process with RIRE scoring, interviews, and acceptance criteria.

**This does NOT apply to post-coding tasks** — when you've already written code and have a PR, Claude will create a simpler task documenting what was done (title prefixed `CLAUDE CODE:`, description + PR link). No RIRE scoring or interview needed.

## Who Should Use This

Anyone requesting development work: product owners, team leads, developers, QA. Use Claude Code to create tasks — it will enforce these guidelines and ask follow-up questions until the task is well-specified.

## How to Create a Task

1. Connect Stride to Claude Code once (create a personal API key in Stride first):

   ```bash
   claude mcp add --transport http --scope user stride https://work.sdsmanager.com/mcp \
     --header "Authorization: Bearer <YOUR_STRIDE_KEY>"
   ```

   Restart Claude Code. Never commit your key.

2. Open Claude Code and describe what you need. Claude will ask clarifying questions, show you a draft, and create the task in Stride only after you confirm. Example:

   > "Create a task: we need to add bulk export of SDS documents as ZIP files from the inventory list page"

Claude will guide you through the required fields below. You can also create a task directly in Stride — use the same structure.

---

## Required Fields for All Development Tasks

### 1. Title
- **Do NOT** prefix with `CLAUDE CODE:` — that prefix is only for post-coding tasks documenting Claude-written code
- Keep it short and specific (under 80 characters)
- Use action verbs: Add, Fix, Update, Remove, Implement, Refactor
- Bad: `SDS thing` / Good: `Add bulk ZIP export for SDS documents`

### 2. Problem Statement
**What problem does this solve and for whom?**
- Who is affected? (end users, admins, internal team, API consumers)
- What is the current behavior or gap?
- What is the impact? (users can't do X, process takes too long, data is wrong)
- Link to customer feedback, support tickets, or business context if available

### 3. Desired Outcome
**What should the end result look like?**
- Describe the expected behavior from the user's perspective
- Include specific examples or scenarios
- If UI is involved: describe the interaction flow (screenshots/mockups are a bonus — attach them to the task)
- If API: describe the endpoint shape, inputs, outputs

### 4. Acceptance Criteria
**How do we know this is done?**
Write as checkable statements:
- [ ] User can select multiple SDS documents from the list
- [ ] "Export as ZIP" button appears when 2+ documents are selected
- [ ] ZIP file downloads within 30 seconds for up to 100 documents
- [ ] Export works for both admin and standard user roles

Minimum 3 acceptance criteria. If you can't write 3, the task isn't well-defined yet.

### 5. Scope
**What is explicitly IN and OUT of scope?**
- **In scope**: The specific changes to deliver
- **Out of scope**: Related things that are NOT part of this task (prevents scope creep)
- Example: "In scope: ZIP export from list view. Out of scope: export from search results, export as PDF bundle"

### 6. Affected Area
Which part of the system does this touch?
- **Frontend only** (React SPA — `sds_inventory_mgr/frontend/`)
- **Backend only** (Django API — `sdsadmin/`)
- **Full stack** (both frontend and backend)
- **Admin panel** (Django admin — `sdsadmin/` internal views)
- **CMS** (`sds_cms/`)
- **Store** (`sds_store/`)
- **Discovery** (`sds-web-sdsdiscovery/`)
- **Infrastructure / DevOps**

### 7. Module
Which module does this task belong to? Stride has no custom fields, so the module is written on the `Module:` line at the top of the description — pick one:

| Module | Description |
|--------|-------------|
| Inventory Manager - Improvements | Enhancements to existing IM features |
| Inventory Manager - UX | UX/UI improvements in IM |
| Inventory Manager - New feature | Brand new IM functionality |
| Inventory Manager - Bugs | Bug fixes in IM |
| APP (progressive web app) | PWA-related work |
| APP (FLUTTER) | Flutter mobile app |
| Extraction pipeline | SDS data extraction pipeline |
| Website & Landing pages | Marketing site, landing pages |
| Website Discovery & Search | Discovery site search features |
| FAQ | FAQ system |
| Authoring | SDS authoring tools |
| SDS Admin - CRM/MSG | Admin CRM & messaging |
| SDS Admin - Harvesting & Quality support tools | Harvesting & quality tools |
| SDS Admin - Misc | Other admin work |
| SDS Admin - SDS Validation | SDS validation & quality scoring |
| SDS Distribution | SDS distribution features |
| Demo API | Demo API |
| NON-CODING TASK | Non-development tasks |
| Other | Anything not listed above |

### 8. RIRE Score (Prioritization)
Every task must include RIRE ratings. They are written on the `RIRE:` line at the top of the description — Stride does not calculate the score, so Claude computes it for you.

Claude will ask you to rate each dimension on a scale of **1–5**:

| Dimension | 1 (Low) | 3 (Medium) | 5 (High) |
|-----------|---------|------------|----------|
| **Reach** | Affects a handful of users | Affects a segment of users | Affects all or most users |
| **Impact** | Minor convenience | Noticeable improvement | Critical blocker or major UX gain |
| **Revenue** | No revenue impact | Indirect revenue impact (retention, efficiency) | Direct revenue impact (new sales, churn prevention) |
| **Effort** | Quick fix (hours) | Moderate work (days) | Major effort (weeks+) |

**Formula:** `RIRE Score = (Reach × Impact × Revenue) / Effort` (range 0.2–125)

### 9. Priority (Auto-Proposed)
Claude will **propose** a priority based on your RIRE score. You confirm or override. The P-level is written on the `Priority:` line of the description and mapped onto Stride's built-in priority field.

| RIRE Score | Proposed Priority | Stride priority |
|------------|-------------------|-----------------|
| ≥ 15 | **P1 - BIG DEAL BLOCKED** | Urgent |
| 8 – under 15 | **P2 - CUSTOMER ESCALATION** | High |
| 3 – under 8 | **P3 - NICE VALUE** | Medium |
| 1 – under 3 | **P4 - LOW VALUE** | Low |
| under 1 | **P6 - IDEA FOR SOMEDAY** | Low |

**Override when needed:** A low-RIRE bug may still be P0 if production is down. A high-RIRE idea may be P6 if there's no capacity this quarter.

All priority levels:
| Priority | When to use | Stride priority |
|----------|-------------|-----------------|
| **P0 - PRODUCTION BUG** | Production is broken, data loss, revenue impact now | Urgent |
| **P1 - BIG DEAL BLOCKED** | A sales deal or key customer is blocked | Urgent |
| **P2 - CUSTOMER ESCALATION** | Customer complaint or escalation | High |
| **P3 - NICE VALUE** | Good value, no urgency | Medium |
| **P4 - LOW VALUE** | Nice to have, backlog | Low |
| **P6 - IDEA FOR SOMEDAY** | Future idea, no commitment | Low |
| **Not sure** | Let the team triage | None |

---

## Recommended Fields (Include When Applicable)

### 10. Dependencies & Blockers
- Does this require another task to be completed first? Name it by its Stride ID (`DIMA-750`).
- Does this depend on a third-party service, API, or external team?
- Are there database migration needs? (Flag explicitly — these need extra care, and get the `db migration` label)

### 11. Edge Cases & Risks
- What could go wrong?
- Are there performance concerns? (large datasets, concurrent users)
- Are there permission/role considerations?
- Could this break existing functionality?

### 12. Technical Context (if known)
- Relevant API endpoints, database tables, or components
- Links to related PRs, past tasks, or documentation
- Known technical constraints

### 13. New Packages or Schema Changes
**If this task will likely require new packages or database changes, flag it explicitly at the top of the description** (`⚠️ DATABASE CHANGES REQUIRED` / `⚠️ NEW PACKAGES REQUIRED`). These require extra review and approval before implementation.

### 14. Mockups / Screenshots / Examples
- Attach screenshots of current behavior (for bugs)
- Attach mockups or wireframes (for new features)
- Link to similar features in other products for reference

---

## Task Types and What to Emphasize

### Bug Reports
Emphasize: **Steps to reproduce**, expected vs actual behavior, browser/environment, screenshots, frequency (always/sometimes/once), severity (data loss? cosmetic? blocking?). Add the `Bug` label.

### New Features
Emphasize: **Problem statement**, user story, acceptance criteria, scope boundaries, mockups

### Improvements / Enhancements
Emphasize: **Current behavior**, why it's insufficient, desired behavior, backward compatibility

### Technical Debt / Refactoring
Emphasize: **What's wrong** with current implementation, risks of not fixing, proposed approach, how to verify nothing breaks

### Data / Migration Tasks
Emphasize: **Exact data changes**, rollback plan, affected records estimate, production impact, timing constraints

### Problems with Stride itself
Bugs or feature requests about Stride go to team `PH` (Project HubOne) with status `Stride` — not to `DIMA`.

---

## What Makes a BAD Task

- "Fix the SDS page" — which page? what's broken? for whom?
- "Make it faster" — what is slow? how fast should it be? where?
- "Add validation" — for which fields? what rules? what error messages?
- No acceptance criteria — nobody knows when it's done
- Mixing multiple unrelated changes in one task
- Copy-pasting a chat message as the entire description

## What Makes a GOOD Task

- A stranger could pick it up and understand what to build
- Acceptance criteria are specific and testable
- Scope is clear — you know what NOT to build
- Priority is set with reasoning
- Dependencies are flagged upfront
- Database/package changes are called out explicitly

---

## Template (for reference — Claude will structure this for you)

```
RIRE: Reach 4 · Impact 3 · Revenue 5 · Effort 2 → Score 30.0
Module: Inventory Manager - New feature
Priority: P1 - BIG DEAL BLOCKED

## Problem
[Who is affected and what's the issue]

## Desired Outcome
[What the end result should look like]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Scope
**In scope:** ...
**Out of scope:** ...

## Affected Area
[Frontend / Backend / Full stack / etc.]

## Dependencies & Blockers
[Any blockers or prerequisites — or "None"]

## Edge Cases & Risks
[What could go wrong]

## Technical Context
[Relevant endpoints, tables, components, links]
```

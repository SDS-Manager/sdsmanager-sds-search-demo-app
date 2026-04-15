# ClickUp Task Creation Guidelines — SDS Manager Dev Project

**Board:** [SDS Manager Dev Project](https://app.clickup.com/90152360809/v/b/6-901521246467-2)
**List ID:** `901521246467`
**Default status for new tasks:** `ADD NEW TASKS HERE`

This guideline applies to all development tasks for the SDS Manager project. All tasks created via Claude Code are added to the board above with status "ADD NEW TASKS HERE" for triage.

## When Does This Apply?

This guideline applies to **request-phase tasks** — new work that hasn't started yet. This is the full process with RIRE scoring, interviews, and acceptance criteria.

**This does NOT apply to post-coding tasks** — when you've already written code and have a PR, Claude will create a simpler task documenting what was done (description + PR link). No RIRE scoring or interview needed.

## Who Should Use This

Anyone requesting development work: product owners, team leads, developers, QA. Use Claude Code to create tasks — it will enforce these guidelines and ask follow-up questions until the task is well-specified.

## How to Create a Task

Open Claude Code and describe what you need. Claude will ask clarifying questions, then create a properly structured ClickUp task on the SDS Manager Dev Project board. Example:

> "Create a ClickUp task: we need to add bulk export of SDS documents as ZIP files from the inventory list page"

Claude will guide you through the required fields below.

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
- If UI is involved: describe the interaction flow (screenshots/mockups are a bonus — attach or link them)
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
Which module does this task belong to? These are set as custom fields in ClickUp — pick one:

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
Every task must include RIRE ratings. These are set as custom fields in ClickUp — the SCORE is auto-calculated by a formula field.

Claude will ask you to rate each dimension on a scale of **1–5**:

| Dimension | 1 (Low) | 3 (Medium) | 5 (High) |
|-----------|---------|------------|----------|
| **Reach** | Affects a handful of users | Affects a segment of users | Affects all or most users |
| **Impact** | Minor convenience | Noticeable improvement | Critical blocker or major UX gain |
| **Revenue** | No revenue impact | Indirect revenue impact (retention, efficiency) | Direct revenue impact (new sales, churn prevention) |
| **Effort** | Quick fix (hours) | Moderate work (days) | Major effort (weeks+) |

**Formula:** `RIRE Score = (Reach × Impact × Revenue) / Effort` (auto-calculated in ClickUp)

| Score Range | Interpretation |
|-------------|---------------|
| **15–25** | Do this first — high value, manageable effort |
| **5–15** | Strong candidate — schedule soon |
| **2–5** | Moderate — plan when capacity allows |
| **< 2** | Low priority — backlog or reconsider |

### 9. Priority (Auto-Proposed)
Claude will **propose** a priority based on your RIRE score. You confirm or override.

| RIRE Score | Proposed Priority |
|------------|-------------------|
| 15–25 | **P1 - BIG DEAL BLOCKED** |
| 8–15 | **P2 - CUSTOMER ESCALATION** |
| 3–8 | **P3 - NICE VALUE** |
| 1–3 | **P4 - LOW VALUE** |
| < 1 | **P6 - IDEA FOR SOMEDAY** |

**Override when needed:** A low-RIRE bug may still be P0 if production is down. A high-RIRE idea may be P6 if there's no capacity this quarter.

All priority levels:
| Priority | When to use |
|----------|-------------|
| **P0 - PRODUCTION BUG** | Production is broken, data loss, revenue impact now |
| **P1 - BIG DEAL BLOCKED** | A sales deal or key customer is blocked |
| **P2 - CUSTOMER ESCALATION** | Customer complaint or escalation |
| **P3 - NICE VALUE** | Good value, no urgency |
| **P4 - LOW VALUE** | Nice to have, backlog |
| **P6 - IDEA FOR SOMEDAY** | Future idea, no commitment |
| **Not sure** | Let the team triage |

---

## Recommended Fields (Include When Applicable)

### 10. Dependencies & Blockers
- Does this require another task to be completed first?
- Does this depend on a third-party service, API, or external team?
- Are there database migration needs? (Flag explicitly — these need extra care)

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
**If this task will likely require new packages or database changes, flag it explicitly at the top of the description.** These require extra review and approval before implementation.

### 14. Mockups / Screenshots / Examples
- Attach screenshots of current behavior (for bugs)
- Attach mockups or wireframes (for new features)
- Link to similar features in other products for reference

---

## Task Types and What to Emphasize

### Bug Reports
Emphasize: **Steps to reproduce**, expected vs actual behavior, browser/environment, screenshots, frequency (always/sometimes/once), severity (data loss? cosmetic? blocking?)

### New Features
Emphasize: **Problem statement**, user story, acceptance criteria, scope boundaries, mockups

### Improvements / Enhancements
Emphasize: **Current behavior**, why it's insufficient, desired behavior, backward compatibility

### Technical Debt / Refactoring
Emphasize: **What's wrong** with current implementation, risks of not fixing, proposed approach, how to verify nothing breaks

### Data / Migration Tasks
Emphasize: **Exact data changes**, rollback plan, affected records estimate, production impact, timing constraints

---

## What Makes a BAD Task

- "Fix the SDS page" — which page? what's broken? for whom?
- "Make it faster" — what is slow? how fast should it be? where?
- "Add validation" — for which fields? what rules? what error messages?
- No acceptance criteria — nobody knows when it's done
- Mixing multiple unrelated changes in one task
- Copy-pasting a Slack message as the entire description

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
## RIRE Score
| Reach | Impact | Revenue | Effort | **Score** |
|-------|--------|---------|--------|-----------|
| 4     | 3      | 5       | 2      | **30.0**  |

**Module:** Inventory Manager

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

## Dependencies
[Any blockers or prerequisites]

## Edge Cases & Risks
[What could go wrong]

## Technical Context
[Relevant endpoints, tables, components, links]
```

# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/visits/visit-tracking-status/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):** Visit tracking & status
- **Feature slug (folder under `plans/`):** `visits`

## Tracker (metadata only)

- **Tracker type:** `none`
- **Work item id:** `` *(used in filenames and plan tables; fill manually if empty)*
- **Work item type:** ``
- **Status:** ``
- **Assignee:** ``
- **Labels:** ``

External tracker links are **not** followed by the planner. Keep the id for naming and traceability only.

---

## Title

*(Paste the work item title verbatim. Prefilled when `squad new-story` fetched from a tracker.)*

```
Visit tracking & status
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
Source: "Employee Managment System.pdf" (client spec), pages 1-2 — pasted verbatim.

Employees
- When an employee is out on a visit, and the visit is not done, the employee can't have
  another active / assigned visit at the same time "and the employee already accepted to
  take"

Visits
- DateTime
- Status "inherited from task"
- Client
- Location "URL" "filtered by selected client"

System user (context):
- Attendance status is calculated depending of the user is in a visit / or a task
  requiring attendance status
```

---

## Acceptance criteria

*(Checklist, bullets, Gherkin, etc. Prefilled for Azure DevOps when the work item has acceptance criteria.)*

```
- [ ] Visit views share the calendar/list/kanban components built for `tasks` (same three
      view modes — the doc groups "Tasks/Visits" together everywhere they're mentioned).
- [ ] Visit detail: date/time, status (read-only, inherited), client, location link (URL),
      filtered location picker that only shows locations for the currently-selected client.
- [ ] Client-side handling of the "no second active visit" rule — surface the backend's
      rejection clearly rather than silently failing (inline error vs disabled action to
      be decided during planning).
- [ ] Employee's current attendance state (computed) shown somewhere visible (e.g. profile
      header or dashboard) — read-only, sourced from the backend, never editable here.
```

---

## Attachments

Place files in `attachments/` next to this `intake.md`, then list them here so the planner knows what to open.

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None. | Source content pasted into Description above. |

---

## Dependencies

- **Blocked by / related ids:** None (tracker: none).
- **Depends on code areas or other stories:** `clients` frontend story (client + location picker), `tasks` frontend story (shared calendar/list/kanban view components), `roles` (view scoping — Supervisor sees team visits, Employee sees only their own).

## Extra notes (optional)

- Source document: `Employee Managment System.pdf` (user's desktop), "Employees" and "Visits" sections.
- Companion backend story: `EmpoloyeeManagment` repo, `.squad/stories/visits/visit-tracking-status/intake.md`.

## Technical hints (optional)

- APIs, screens, services already discussed. Repos/roots: `.`. Primary language: `typescript`.
- Reuse the `clients` feature's location data rather than re-fetching independently — check `src/lib/query-keys.ts` for the right key factory to depend on.

## Out of scope

- Task-specific UI (comments, attachments, accept/reject) — separate `tasks` story.

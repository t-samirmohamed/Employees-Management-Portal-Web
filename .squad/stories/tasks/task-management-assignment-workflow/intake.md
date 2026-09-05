# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/tasks/task-management-assignment-workflow/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):** Task management & assignment workflow
- **Feature slug (folder under `plans/`):** `tasks`

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
Task management & assignment workflow
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
Source: "Employee Managment System.pdf" (client spec), pages 1-2 — pasted verbatim.

Supervisors:
- Assign/Reassign Tasks/Visits in a calendar, list, and kanban views, and their details

Employees
- View their assigned Tasks/Visits in a calendar, list, and kanban views and take action
  "Accept/ Reject Stating Reason"
- View their list of tasks/visits and details

Tasks
- Name / Due DateTime(Visit day) / Assignee / Related Visit "optional"/ Attachments/Notes
  / Status (Computed "new - in progress once accepted - rejected - cancelled - done")
  (linked to visit status) / attendance required status
- Comments (Add / Delete / Update)
- Delete attachment
```

---

## Acceptance criteria

*(Checklist, bullets, Gherkin, etc. Prefilled for Azure DevOps when the work item has acceptance criteria.)*

```
- [ ] New src/features/tasks/ feature with calendar, list, and kanban views of tasks
      (three view modes over one underlying query, likely a view-mode toggle).
- [ ] Task detail view: name, due date/time, assignee, related visit (if any),
      attachments, notes, status, attendance-required indicator.
- [ ] Employee actions: Accept / Reject (with a required reason field) on an assigned
      task.
- [ ] Supervisor actions: assign / reassign a task (assignee picker, due date, optional
      related visit).
- [ ] Comments UI: add / edit / delete, inline on task detail.
- [ ] Attachments UI: upload, list, delete.
- [ ] Status displayed using the same computed values as backend
      (New/InProgress/Rejected/Cancelled/Done) — read-only badge, never user-editable.
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
- **Depends on code areas or other stories:** `roles` (role-gated actions: assign/reassign is Supervisor-only, accept/reject is Employee-only), backend companion `tasks` story. Shares the calendar/list/kanban view components with the `visits` frontend story — plan the shared view-mode component once, not twice.

## Extra notes (optional)

- Source document: `Employee Managment System.pdf` (user's desktop), "Supervisors", "Employees", and "Tasks" sections.
- Companion backend story: `EmpoloyeeManagment` repo, `.squad/stories/tasks/task-management-assignment-workflow/intake.md`.

## Technical hints (optional)

- APIs, screens, services already discussed. Repos/roots: `.`. Primary language: `typescript`.
- No calendar/kanban library is in `package.json` yet — planning should pick one (e.g. `@dnd-kit` for kanban drag/drop, a calendar grid lib) rather than hand-rolling.

## Out of scope

- Visit-specific fields/screens (separate `visits` story).
- Leave request UI (separate `leaves` story).

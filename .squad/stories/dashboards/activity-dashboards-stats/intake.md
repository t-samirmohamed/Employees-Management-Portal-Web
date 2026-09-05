# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/dashboards/activity-dashboards-stats/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):** Activity dashboards & stats
- **Feature slug (folder under `plans/`):** `dashboards`

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
Activity dashboards & stats
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
Source: "Employee Managment System.pdf" (client spec), page 1 — pasted verbatim.

Admins/Managers:
- Should be able to view an employee's monthly activity "Tasks - Visits -Attendance State
  - Leaves" for every employee in their details view
- Status/visits stats
- Client visits stats and most visited clients
- Should be able to view all supervisors and their teams and stats for all the employees
  /supervisors and all the open tasks/ employees attendance status, etc., categorized per
  team/suprvisor in their detailed views.

Supervisors:
- Status/visits stats
- Review an employee's monthly activity "Tasks - Errands- Attendance/Attendance State -
  Leaves" for every employee
```

---

## Acceptance criteria

*(Checklist, bullets, Gherkin, etc. Prefilled for Azure DevOps when the work item has acceptance criteria.)*

```
- [ ] Extend the existing src/features/statistics/ feature (or add a sibling) with:
  - [ ] Employee detail view: monthly activity rollup (tasks/visits/attendance/leaves) —
        Admin/Manager see any employee, Supervisor sees their team.
  - [ ] Status/visit stat tiles.
  - [ ] Client visit stats + "most visited clients" widget.
  - [ ] Supervisor/team rollup view for Admin/Manager, categorized per team.
- [ ] Supervisor's own "status/visits stats" widget on their landing dashboard.
```

---

## Attachments

Place files in `attachments/` next to this `intake.md`, then list them here so the planner knows what to open.

| File (relative to this folder) | What it is |
| ------------------------------ | ---------- |
| None. | Source content pasted into Description above. |

---

## Dependencies

- **Blocked by / related ids:** None (tracker: none). Plan last, alongside/after `clients`, `tasks`, `visits`, `leaves` frontend stories since it visualizes their data.
- **Depends on code areas or other stories:** `src/features/statistics/` (existing), `roles` (view scoping), plus data from `clients`/`tasks`/`visits`/`leaves` frontend stories.

## Extra notes (optional)

- Source document: `Employee Managment System.pdf` (user's desktop), "Admins/Managers" and "Supervisors" sections.
- Companion backend story: `EmpoloyeeManagment` repo, `.squad/stories/dashboards/activity-dashboards-stats/intake.md`.

## Technical hints (optional)

- APIs, screens, services already discussed. Repos/roots: `.`. Primary language: `typescript`.
- `/statistics` route and `src/features/statistics/` already exist — extend, don't duplicate.

## Out of scope

- Task/visit/leave/client CRUD UI itself — separate stories.

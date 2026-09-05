# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/leaves/leave-requests-approval-workflow/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):** Leave requests & approval workflow
- **Feature slug (folder under `plans/`):** `leaves`

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
Leave requests & approval workflow
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
Source: "Employee Managment System.pdf" (client spec), pages 1-2 — pasted verbatim.

Admins/Managers:
- Should receive a notification when an employee/Supervisor submits a leave request and
  take action "Accept/Reject/Request Delay to a specific date and stating a reason"
- Managers can submit a leave request and should be able to edit/delete it for Admins to
  take action on

Supervisors:
- Should receive a notification when an employee submits a leave request and take action
  "Accept/Reject/Request Delay to a specific date and stating a reason"
- Can submit a leave request and should be able to edit/delete it for Managers to take
  action on

Employees
- Can submit a leave request and should be able to edit/delete it for
  Managers/Supervisors/Admins to take action on
```

---

## Acceptance criteria

*(Checklist, bullets, Gherkin, etc. Prefilled for Azure DevOps when the work item has acceptance criteria.)*

```
- [ ] New src/features/leaves/ feature: a submit-leave-request form (available to
      Employee, Supervisor, Manager).
- [ ] "My requests" list with edit/delete, disabled once a request leaves Pending.
- [ ] Approver queue/list (Admin/Manager/Supervisor, scoped to who they're allowed to
      action per the `roles` story) with Accept / Reject (reason required) / Request
      Delay (date + reason required) actions.
- [ ] Status badges matching backend's Pending/Accepted/Rejected/DelayRequested.
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
- **Depends on code areas or other stories:** `roles` (approver-queue scoping), backend companion `leaves` story. Feeds the `notifications` frontend story (an approver's notification links into this feature's approver queue).

## Extra notes (optional)

- Source document: `Employee Managment System.pdf` (user's desktop), "Admins/Managers", "Supervisors", and "Employees" sections.
- Companion backend story: `EmpoloyeeManagment` repo, `.squad/stories/leaves/leave-requests-approval-workflow/intake.md`.

## Technical hints (optional)

- APIs, screens, services already discussed. Repos/roots: `.`. Primary language: `typescript`.
- Form validation via `zod` + `react-hook-form`, matching the existing `src/features/auth/schemas/` / `src/features/employees/schemas/` pattern.

## Out of scope

- Notification bell/inbox UI itself (separate `notifications` story) — this story only needs the approver queue the notification will deep-link to.

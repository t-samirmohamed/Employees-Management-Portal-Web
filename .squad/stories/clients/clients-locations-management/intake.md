# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/clients/clients-locations-management/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):** Clients & locations management
- **Feature slug (folder under `plans/`):** `clients`

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
Clients & locations management
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
Source: "Employee Managment System.pdf" (client spec), pages 1-2 — pasted verbatim.

Admins/Managers:
- Client visits stats and most visited clients
- All Clients List and their details

Supervisors:
- Assigned Client list based to the assigned location

Clients:
- Name/Email/Contact
- List of locations: Name/Email/Contact
- Stats of visits for this month/3month/6month/year
```

---

## Acceptance criteria

*(Checklist, bullets, Gherkin, etc. Prefilled for Azure DevOps when the work item has acceptance criteria.)*

```
- [ ] New src/features/clients/ feature: list view (Admin/Manager: all; Supervisor:
      assigned-location-only, per role gating from the `roles` story), detail view showing
      a client's locations.
- [ ] Client detail shows visit stats for month/3month/6month/year (stat tiles or a small
      chart — reuse whatever pattern the existing statistics feature already uses).
- [ ] Location display includes Name/Email/Contact per location, listed under the client
      detail.
- [ ] Hooks + query keys following the existing employeeKeys/use-employees pattern
      (clientKeys, use-clients, use-client).
- [ ] Route added under the (dashboard) route group, e.g. /clients, gated by AuthGuard +
      role guard.
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
- **Depends on code areas or other stories:** `roles` story (role-gating primitive), backend companion `clients` story (endpoints must exist). The `visits` frontend story will link into client detail (a visit's location is "filtered by selected client").

## Extra notes (optional)

- Source document: `Employee Managment System.pdf` (user's desktop), "Admins/Managers", "Supervisors", and "Clients" sections.
- Companion backend story: `EmpoloyeeManagment` repo, `.squad/stories/clients/clients-locations-management/intake.md`.

## Technical hints (optional)

- APIs, screens, services already discussed. Repos/roots: `.`. Primary language: `typescript`.
- Mirror `src/features/employees/` structure (`components/`, `hooks/`, `schemas/`, `types/`).

## Out of scope

- Visit calendar/kanban views (separate `visits`/`tasks` stories).
- Cross-client "most visited" ranking (belongs to `dashboards`).

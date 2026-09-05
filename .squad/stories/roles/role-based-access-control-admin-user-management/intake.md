# Story intake

Fill this template for each story you want planned. Keep it copy-paste-friendly: the planner reads **this file and the files in `attachments/`**, nothing else.

- Folder: `.squad/stories/roles/role-based-access-control-admin-user-management/intake.md`
- Binaries (screenshots, PDFs, exports): put them in `attachments/` next to this file and list them below.
- Do **not** rely on external links (tracker URLs, wiki, chat) — the planner cannot open them. Paste the content you want considered.

This is **not** an implementation prompt. It is the input to the plan-generation meta-prompt bundled with squad-kit (`generate-plan.md` in the installed package).

---

## Feature

- **Feature name (display):** Role-based access control & admin user management
- **Feature slug (folder under `plans/`):** `roles`

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
Role-based access control & admin user management
```

---

## Description

*(Paste the full work item description. Prefilled when fetched from a tracker.)*

```
Source: "Employee Managment System.pdf" (client spec), page 1 — "System user" and "Admins"
sections, pasted verbatim.

System user:
- System permission on all actions and lists/details view
- Admin role overrides any other role
- Attendance status is calculated depending of the user is in a visit / or a task
  requiring attendance status

Admins
- View all system users
- Can add any other roles
- Is the only user permitted to activate/deactivate employees/supervisors

(The rest of the spec repeatedly refers to four roles — Admin, Manager, Supervisor,
Employee — each with different capabilities. Those per-role capabilities are broken out
into the other sibling stories in this workspace: clients, tasks, visits, leaves,
notifications, dashboards. This story is only the role-gating primitive + admin user
management screen, which every other story's UI depends on.)
```

---

## Acceptance criteria

*(Checklist, bullets, Gherkin, etc. Prefilled for Azure DevOps when the work item has acceptance criteria.)*

```
- [ ] Decode/store the user's role from the JWT (or a /me response) alongside the existing
      session in token-storage.ts / auth-context.tsx.
- [ ] Role-gating primitive: a RequireRole-style guard (parallel to the existing AuthGuard)
      for Admin-only screens vs Manager/Supervisor/Employee screens.
- [ ] New Admin screen: list all system users with role + linked employee (consumes the
      backend's new GET /api/users).
- [ ] Admin-only control on the employee detail view to activate/deactivate (hide/disable
      for non-Admins — today use-activate-employee/use-deactivate-employee are callable by
      any authenticated user).
- [ ] Admin flow to create a user with a chosen role (extends the signup form or a new
      admin "create user" form).
- [ ] Nav/menu items conditionally rendered per role (full per-role detail lives in the
      other feature stories; this story only needs the gating primitive they'll all use).
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
- **Depends on code areas or other stories:** `src/features/auth/lib/auth-context.tsx`, `src/features/auth/components/auth-guard.tsx`, `src/lib/api-client.ts`. Backend companion story (same slug, `EmpoloyeeManagment` repo) must ship the role claim + `/api/users` endpoint first. Every other frontend story (clients/tasks/visits/leaves/notifications/dashboards) depends on the role-gating primitive this story introduces.

## Extra notes (optional)

- Source document: `Employee Managment System.pdf` (user's desktop).
- Companion backend story: `EmpoloyeeManagment` repo, `.squad/stories/roles/role-based-access-control-admin-user-management/intake.md`.
- Current state: [auth](../../../plans/auth/00-current-state.md) and [employees](../../../plans/employees/00-current-state.md) — no role concept anywhere in the client today.

## Technical hints (optional)

- APIs, screens, services already discussed. Repos/roots: `.`. Primary language: `typescript`.
- Follow the existing feature-folder convention: new `src/features/users/` (or extend `src/features/auth/`) with its own `hooks/`, `components/`, `schemas/`, `types/`.
- Reuse the `src/lib/query-keys.ts` pattern for a new `userKeys` factory.

## Out of scope

- Any UI for clients/tasks/visits/leaves/notifications/dashboards — separate stories.
- Non-JWT session mechanisms.

# Plans index

One row per feature folder under `.squad/plans/`. `NN` continues as a global execution sequence across all features when `naming.globalSequence` is `true` in `config.yaml`.

| Feature | Overview | NN range |
|---------|----------|----------|
| [auth](auth/00-current-state.md) | Login/signup pages, localStorage session, AuthGuard | 00 (baseline) |
| [employees](employees/00-current-state.md) | List/create/detail pages + statistics | 00 (baseline) |
| [users](users/00-current-state.md) | Not started — no feature folder or route | 00 (baseline) |
| [logs](logs/00-current-state.md) | Not started — no feature folder or route | 00 (baseline) |

## Planned — not yet implemented

Broken out from `Employee Managment System.pdf` (client spec, full system). Each row has a ready intake; `plans/<slug>/00-overview.md` stays an empty stub until `squad new-plan` is run against it. Suggested build order follows the "Depends on" column.

| Feature | Intake | Depends on |
|---------|--------|------------|
| [roles](roles/00-overview.md) | [Role-gating primitive + admin user management screen](../stories/roles/role-based-access-control-admin-user-management/intake.md) | — (foundational, build first) |
| [clients](clients/00-overview.md) | [Clients + locations list/detail, visit stats](../stories/clients/clients-locations-management/intake.md) | roles |
| [tasks](tasks/00-overview.md) | [Task calendar/list/kanban, assign/accept/reject, comments, attachments](../stories/tasks/task-management-assignment-workflow/intake.md) | roles |
| [visits](visits/00-overview.md) | [Visit views (shared with tasks), status, location picker](../stories/visits/visit-tracking-status/intake.md) | clients, tasks |
| [leaves](leaves/00-overview.md) | [Leave request form, my-requests, approver queue](../stories/leaves/leave-requests-approval-workflow/intake.md) | roles |
| [notifications](notifications/00-overview.md) | [Notification bell/inbox for leave requests](../stories/notifications/leave-request-notifications/intake.md) | leaves |
| [dashboards](dashboards/00-overview.md) | [Monthly activity rollups, team/client stat widgets](../stories/dashboards/activity-dashboards-stats/intake.md) | clients, tasks, visits, leaves |

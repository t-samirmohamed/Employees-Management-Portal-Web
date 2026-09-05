# roles — plan overview

Entry point for the **roles** feature. Stories execute in order by their `NN` prefix.

## Stories

| NN | File | Title | Tracker id | Depends on |
|----|------|-------|------------|------------|
| 01 | [01-story-role-gating-and-admin-user-management.md](01-story-role-gating-and-admin-user-management.md) | Role Gating & Admin User Management | none | Backend `roles` story (shipped) |

## Dependency notes

Foundational — every other frontend story (`tasks`, `clients`, `visits`, `leaves`, `dashboards`, `notifications`) depends on the `useHasRole`/`RequireRole` primitives this story introduces. `AssignedLocationId` on the create-user form is deferred until `clients` ships a location picker.

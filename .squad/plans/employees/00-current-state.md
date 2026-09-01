# Employees — current state

_Snapshot of what's implemented, not a story to execute. Read this before planning new employee work._

## Implemented
- Routes: `(dashboard)/employees` list, `/employees/new`, `/employees/[id]` detail — all gated by `AuthGuard`.
- `src/features/employees/` — components, hooks, schemas, types; one TanStack Query hook per backend endpoint, keys centralized in `src/lib/query-keys.ts` (`employeeKeys`).
- Domain enums (`src/shared/types/enums.ts`) intentionally mirror the backend's exact wire values (`Gender`, `EmployeeStatus`, `AttendanceStatus`) — not display labels.
- `(dashboard)/statistics` route/feature surfaces `GET /api/statistics/employees`.

## Not implemented
- No edit/delete UI — matches the backend's v1 gap (only create + activate/deactivate exist).

## Key files
- `src/features/employees/**`, `src/app/[locale]/(dashboard)/employees/**`, `src/app/[locale]/(dashboard)/statistics/**`

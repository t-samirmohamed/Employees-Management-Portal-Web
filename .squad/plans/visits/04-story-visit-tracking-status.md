# Story 04 — Visit Tracking & Status

## Prerequisites

- Story 01 (`roles`), Story 02 (`tasks` — shared `src/shared/components/view-modes/`), Story 03 (`clients` — client/location data).
- Backend contract (`EmpoloyeeManagment/Endpoints/VisitEndpoints.cs`, `Dtos/Visits/VisitDtos.cs`) already extracted during initial research (Context item 1).

## Story Goal

1. `/visits` — list/calendar/kanban (reusing Story 02's shared substrate), row-scoped server-side (Employee: own only; others: all).
2. `/visits/{id}` — date/time, status (read-only, inherited from the linked task), client, location (linked to the client's detail page — there is no standalone location page), and a link through to the underlying task (visit status/actions are entirely task-driven; there is no visit-specific accept/cancel/etc. endpoint).
3. `/visits/new` — create: Client select → **Location select filtered to that client's locations** (the intake's explicit "filtered by selected client" requirement) → Assignee select → date/time → optional name/notes. Surfaces the backend's two 400 rules as inline form errors: location-doesn't-belong-to-client, and the "employee already has another accepted visit" concurrency rule.
4. Current user's own attendance status shown in the dashboard nav (satisfies the intake's "shown somewhere visible... read-only" criterion) — reuses `EmployeeListItem.attendanceStatus`, already fetched by the promoted `useEmployeeLookup` hook (task 1).

**Promotion, not duplication**: `useEmployeeLookup` (built in Story 02 for Tasks) is promoted from `@features/tasks/hooks/` to `src/shared/hooks/` in this story, since Visits is now a second, real consumer of the exact same "resolve employee id → name, resolve current user's own employee row" need — this is the second-use promotion the Story 02 plan flagged as a breadcrumb, not a new abstraction invented ahead of need.

**Visits' kanban/calendar views are read-only** (no drag-to-change-status): status is inherited from the task, and there is no visit-level action endpoint to call on drop — dragging a visit card would either do nothing (confusing) or need to silently redirect to the task (also confusing). `KanbanBoard` (Story 02) gets a `readOnly` prop instead.

**Out of scope** (per intake): task-specific UI (comments, attachments, accept/reject) — that's the task the visit links to, reached via a link, not duplicated here.

## Context — Read These Files First

1. **Backend contract** (`EmpoloyeeManagment/Endpoints/VisitEndpoints.cs`, `Dtos/Visits/VisitDtos.cs`, extracted in full during initial research): `GET /api/visits/` (any authenticated; Employee row-scoped via the linked task's `AssigneeId`), `GET /api/visits/{id}` (404 if not visible), `POST /api/visits/` (`TaskAssigner`). `CreateVisitRequest(DateTime, ClientId, LocationId, AssigneeId, Name?, Notes?)`. `VisitListItemDto(Id, DateTime, ClientId, LocationId, AssigneeId, Status, TaskId)`; `VisitDetailDto` adds `CreatedAt`. Validation: `ClientId`/`LocationId`/`AssigneeId` must exist (404 each); `location.ClientId != ClientId` → 400 `"The selected location does not belong to the selected client."`; same one-active-visit-task rule as `AcceptTaskAsync` → 400 `"This employee already has another accepted visit that isn't done yet."` `Name` defaults server-side to `"Visit on {date} {time}"` if omitted.
2. `src/features/tasks/hooks/use-employee-lookup.ts` (whole file, from Story 02) — moved verbatim to `src/shared/hooks/use-employee-lookup.ts` in this story, extended to also return the full `currentEmployee` object (not just its id), since the attendance badge (task 6) needs `attendanceStatus` off it.
3. `src/shared/components/view-modes/kanban-board.tsx`, `calendar-month-view.tsx` (Story 02) — `CalendarMonthView` is reused completely unchanged (pure read-only rendering already); `KanbanBoard` gets one new optional prop.
4. `src/features/clients/hooks/use-clients.ts`, `use-client.ts`, `types/client.types.ts` (Story 03) — `useClients()` for the create form's Client select; `useClient(clientId)` (called with the **currently-selected** client id, watched via `form.watch`) to get that client's `locations` for the filtered Location select.
5. `src/features/tasks/components/task-status-badge.tsx` — `TaskStatusBadge`/`taskStatusColorClass` reused as-is for a Visit's (task-inherited) status — no separate `VisitStatusBadge` needed since the enum is identical (`TaskItemStatus`).

## Frontend Tasks

`No backend changes required.`

### 0b — Fixed stale attendance badge: task mutations weren't invalidating `employeeKeys`

Discovered while verifying task 8's attendance badge: `use-accept-task.ts`, `use-cancel-task.ts`, `use-complete-task.ts`, `use-reassign-task.ts` (all from Story 02) only ever invalidated `taskKeys`, never `employeeKeys` — but all four can flip `Employee.AttendanceStatus` server-side for `AttendanceRequired` tasks (accept/cancel/complete directly; reassign for the *previous* assignee). Without this, the new attendance badge (and the Employees list's own attendance column) would silently show stale data after exactly the actions this story's UI is supposed to make visible. Fixed: all four now also `invalidateQueries({queryKey: employeeKeys.lists()})` in `onSuccess`, unconditionally (cheap extra refetch on the no-op case, same tradeoff `use-create-employee.ts` already makes for `statisticsKeys`).

### 0 — Fixed a real bug in `api-client.ts` while wiring this story's inline error handling

**File: `src/lib/api-client.ts`** — verified empirically (`curl` against a running backend, `GET /api/clients/{id}/visit-stats?range=bogus`) that a `TypedResults.BadRequest("some string")` response body is a **bare JSON string**, not `{title: "..."}`. The prior code (`data?.title ?? "Request failed (400)"`) silently discarded every such message app-wide (affects every plain-string 400 across the whole backend — Tasks' status-transition errors included, not just this story's two). Fixed: `typeof data === "string" ? data : (data?.title ?? ...)`. This is a pre-existing bug from Story 02, not introduced by this story — fixed here because this story is the first to actually depend on real 400 message text reaching the UI.

### 1 — Promote `useEmployeeLookup` to `src/shared/hooks/`

**Create file: `src/shared/hooks/use-employee-lookup.ts`** — same body as the Story 02 file, plus:
```ts
return {
  getName: (id: number) => { /* unchanged */ },
  employees: employees ?? [],
  currentEmployeeId: currentEmployee?.id ?? null,
  currentEmployee: currentEmployee ?? null, // new: full row, for attendanceStatus (task 6)
};
```
**Delete file: `src/features/tasks/hooks/use-employee-lookup.ts`.** Update its 4 import sites (`task-form.tsx`, `task-kanban-view.tsx`, `tasks/page.tsx`, `tasks/[id]/page.tsx`) from `@features/tasks/hooks/use-employee-lookup` to `@/shared/hooks/use-employee-lookup`.

### 2 — `KanbanBoard`'s `readOnly` prop

**File: `src/shared/components/view-modes/kanban-board.tsx`** — add `readOnly?: boolean` to `KanbanBoard`'s props (default `false`) and to `KanbanCard`'s; when true, `KanbanCard` renders a plain non-draggable `<div>` (skip `useDraggable`'s `listeners`/`attributes`) and `KanbanColumnDropZone` skips `useDroppable` (columns are still visually grouped, just not drop targets). Existing Tasks usage is unaffected (prop defaults `false`).

### 3 — `visitKeys`

**File: `src/lib/query-keys.ts`** — append:
```ts
export const visitKeys = {
  all: ["visits"] as const,
  lists: () => [...visitKeys.all, "list"] as const,
  list: () => [...visitKeys.lists()] as const,
  details: () => [...visitKeys.all, "detail"] as const,
  detail: (id: number) => [...visitKeys.details(), id] as const,
};
```

### 4 — Types, schema, hooks

**Create file: `src/features/visits/types/visit.types.ts`** — `VisitListItem{id, dateTime, clientId, locationId, assigneeId, status: TaskItemStatus, taskId}`, `VisitDetail = VisitListItem & {createdAt}`, `CreateVisitRequest{dateTime, clientId, locationId, assigneeId, name?, notes?}`.

**Create file: `src/features/visits/schemas/create-visit.schema.ts`** — `clientId`/`locationId`/`assigneeId: z.number().int().positive(...)`, `visitDate`/`visitTime: z.string().min(1,...)` (combined at submit, same pattern as `create-task.schema.ts`), `name`/`notes: z.string().trim().optional()`.

**Create files**: `hooks/use-visits.ts` (`GET /api/visits`), `hooks/use-visit.ts` (`GET /api/visits/{id}`), `hooks/use-create-visit.ts` (`POST /api/visits`, invalidates `visitKeys.lists()`) — identical shape to the Tasks hooks.

### 5 — View components

**Create file: `src/features/visits/lib/to-scheduled-item.ts`** — same shape as tasks': `title` = `` `${client name via id — see note} · ${getName(assigneeId)}` ``. **Note**: `VisitListItemDto` has no client name, only `clientId` — resolve it via a small local map built from `useClients()`'s result (parallel to `getName` for employees), not a second network round-trip per row.

**Create files**: `components/visit-list-view.tsx` (table: Date/Time, Client, Location, Assignee, Status via `TaskStatusBadge`), `components/visit-calendar-view.tsx` (thin wrapper around `CalendarMonthView`), `components/visit-kanban-view.tsx` (thin wrapper around `KanbanBoard` with `readOnly` — no drop handler needed at all since nothing can be dropped).

### 6 — Create form with client-filtered location picker

**Create file: `src/features/visits/components/visit-form.tsx`**:
- `clientId` field (`Select`, options from `useClients()`).
- `locationId` field (`Select`, options from `useClient(watchedClientId).data?.locations ?? []` — `watchedClientId = form.watch("clientId")`; reset `locationId` via `form.resetField` whenever `clientId` changes so a stale location from a previously-selected client can't be submitted).
- `assigneeId` (`Select`, options from the shared `useEmployeeLookup().employees`).
- Date (`Calendar`+`Popover`, same recipe as `task-form.tsx`) + time (`Input type="time"`), combined at submit exactly like Tasks.
- `name`/`notes` optional (`Input`/`Textarea`).
- **Both backend 400s surfaced inline**: on mutation error, if the message matches the "doesn't belong to" text → `form.setError("locationId", {message: ...})`; if it matches the "already has another accepted visit" text → `form.setError("assigneeId", {message: ...})`; anything else → generic toast. (`ApiError` carries the raw message string — match on it directly since these particular 400s aren't `ValidationApiError`-shaped `errors` dictionaries, just a plain string body per `ClientEndpoints`/`VisitEndpoints`' `TypedResults.BadRequest(string)` — confirm this against the actual thrown error shape from `api-client.ts`'s `ApiError` before wiring the match, since `ApiError.message` is what `request()` sets from `data?.title` — verify a plain-string 400 body actually round-trips into `.message` as expected, not silently becoming "Request failed (400)".)

### 7 — Pages

- `src/app/[locale]/(dashboard)/visits/page.tsx` — list + view toggle (URL-persisted `?view=`, same as Tasks), `Add visit` visible via `useHasRole("Admin","Manager","Supervisor")`.
- `src/app/[locale]/(dashboard)/visits/new/page.tsx` — `RequireRole(["Admin","Manager","Supervisor"])`.
- `src/app/[locale]/(dashboard)/visits/[id]/page.tsx` — fields, `TaskStatusBadge`, a link to the client (`/clients/{clientId}`) satisfying the intake's "location URL" as "linked through to where the location actually lives" (no standalone location page exists), and a link to the underlying task (`/tasks/{taskId}`) for anyone who needs to act on its status.

### 8 — Current-user attendance badge + nav

**File: `(dashboard)/layout.tsx`** — add a `Visits` nav link (visible to everyone, matching Tasks — any authenticated role can view `/api/visits`); add a small attendance badge next to the theme toggle, reusing `AttendanceBadge` from `@features/employees/components/enum-badge.tsx` fed by the shared `useEmployeeLookup().currentEmployee?.attendanceStatus` (render nothing while it's still loading/null — no layout jump handling needed beyond that).

### 9 — Translations

`nav.visits`, a `visits` namespace (`list`, `fields`, `create` incl. server-error messages, `detail`) mirroring `tasks`'.

## Edge Cases

- **`locationId` becomes stale after changing `clientId`** — `form.resetField("locationId", {defaultValue: undefined})` in the `clientId` field's `onValueChange`, so a location from the previous client can never be silently submitted alongside a new client.
- **Client with zero locations** — the Location `Select` renders with no options; the form's required-field validation blocks submit with the standard "required" message, no special empty-state copy needed.
- **The "already has another accepted visit" 400** — attaches to `assigneeId` specifically (it's about the assignee's *other* work, not this form's own fields being wrong) rather than a generic top-level error, so the user knows which field to change (pick a different assignee) — see task 6.
- **Visit list before any visits exist** — same empty-state message pattern as Tasks/Clients.

## Test Plan

1. Create a visit: pick a client, confirm the location list narrows to just that client's locations, pick one, pick an assignee, date/time; confirm it appears in the list/calendar/kanban with status `New` (inherited from its auto-created task).
2. Concurrency rule: accept the visit's linked task (via `/tasks/{taskId}/accept`) as its assignee, then try creating a second visit for the same assignee; confirm the inline `assigneeId` error surfaces the backend's real message.
3. Location-mismatch: attempt (via direct API manipulation or a stale form state, if reachable) a location that doesn't belong to the selected client; confirm the inline `locationId` error.
4. Row scoping: Employee sees only their own visits; Admin/Manager/Supervisor see all.
5. Attendance badge: after accepting the visit's task (which is `AttendanceRequired: true` by construction), confirm the assignee's attendance badge in the nav flips to `OutOfOffice`.
6. Kanban view: confirm visit cards render but do not respond to drag (no status change attempted, no console error).
7. Regression: Stories 01–03 and pre-existing flows.

## Verification Steps

1. `npm run build` && `npm run lint`.
2. Manual browser walkthrough of the Test Plan.

## Done Criteria

- [ ] `useEmployeeLookup` promoted to `src/shared/hooks/`; Tasks' imports updated; old file removed.
- [ ] `KanbanBoard` supports `readOnly`.
- [ ] `visitKeys` + `src/features/visits/` implemented end-to-end.
- [ ] `/visits`, `/visits/new`, `/visits/{id}` implemented with client-filtered location picker and inline surfacing of both backend 400 rules.
- [ ] Nav shows `Visits` for everyone; current-user attendance badge visible.
- [ ] `en.json`/`ar.json` updated.
- [ ] Manual Test Plan passes.

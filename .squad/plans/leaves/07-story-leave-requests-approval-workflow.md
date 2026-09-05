# Story 07 — Leave Requests & Approval Workflow

## Prerequisites

- Story 01 (`roles`). Backend contract (`EmpoloyeeManagment/Endpoints/LeaveEndpoints.cs`, `Dtos/Leaves/LeaveDtos.cs`) already extracted during initial research (Context item 1).
- No dependency on `tasks`/`clients`/`visits` — this story is functionally independent of them (confirmed during initial multi-story planning).

## Story Goal

1. `/leaves` — one page, two sections, both derived from the same `GET /api/leaves` call (the backend returns "own only" for a plain Employee and "everyone" for Admin/Manager/Supervisor — there's no separate query per section):
   - **My Requests**: every row where `requesterId === currentEmployeeId` (via the shared `useEmployeeLookup`). Submit form always available (Employee/Manager/Supervisor — `LeaveRequester` policy; **not** Admin, who cannot submit per the backend policy). Edit/Delete only on the requester's own `Pending` rows.
   - **Approver Queue** (Admin/Manager/Supervisor only — `TaskAssigner`): every other row. Accept / Reject (reason) / Request Delay (date + reason) on `Pending` rows.
2. Status badges for all four `LeaveRequestStatus` values.

**Known, accepted limitation — no client-side rank pre-filtering of the approver queue.** The backend's rank rule (`callerRank > requesterRank`, `Employee=0 < Supervisor=1 < Manager=2 < Admin=3`) determines who may actually action a given row, but a Manager or Supervisor **cannot** resolve a request's requester's *role* client-side — that requires `GET /api/users`, which is Admin-only. So Accept/Reject/Request-Delay buttons are shown for **every** `Pending` row to **every** privileged viewer, and an attempt the backend's rank check rejects simply surfaces as a generic error toast (no crash, no silent failure) — this is the honest behavior given what's actually resolvable client-side, not an oversight to fix later without a new backend capability (e.g. a "my rank" or requester-role field on the list DTO).

**No `/leaves/{id}` detail route** — the intake's acceptance criteria only ask for two lists with inline actions, not a detail page; edit/reject/delay all happen via dialogs directly from the list row, matching the `reassign-task-dialog.tsx`/`reject-task-dialog.tsx` precedent from Story 02.

## Context — Read These Files First

1. **Backend contract** (`EmpoloyeeManagment/Endpoints/LeaveEndpoints.cs`, `Dtos/Leaves/LeaveDtos.cs`, extracted in full during initial research): `GET /api/leaves/` (no policy — any authenticated; non-privileged → own only via `RequesterId==caller.Id`; privileged Admin/Manager/Supervisor → all). `GET /api/leaves/{id}` (404 unless own or privileged). `POST /api/leaves/` (`LeaveRequester`: Employee/Manager/Supervisor — **not Admin**) creates `Pending`. `PATCH`/`DELETE /api/leaves/{id}` (group default — any authenticated, but requester-only: 403 else; `Pending`-only: 400 else — **no privileged-role override on edit/delete, not even Admin**). `PATCH /api/leaves/{id}/accept|reject|request-delay` (`TaskAssigner`) + rank check (`GetCallerRoleRank`: Admin=3/Manager=2/Supervisor=1/else 0; `GetRoleRank` of the *requester*, looked up live via the `AspNetRoles`/`AspNetUserRoles` join — same pattern `StatisticsEndpoints`/`UserEndpoints` already use — table: `Employee=0, Supervisor=1, Manager=2, Admin=3`; action allowed only if `callerRank > requesterRank`, so an Admin can never action another Admin's request).
2. `CreateLeaveRequestRequest(StartDate, EndDate, Reason)`; `UpdateLeaveRequestRequest` identical shape; `RejectLeaveRequestRequest(Reason)`; `RequestDelayRequest(TargetDate, Reason)`. `LeaveRequestListItemDto(Id, RequesterId, StartDate, EndDate, Status, ApproverEmployeeId)`; `LeaveRequestDetailDto` (unused by this story — no detail route) adds `Reason, DecisionReason, RequestedDelayDate, CreatedAt, UpdatedAt`. **The list DTO has no `Reason` field** — the submit/edit form's own `Reason` isn't shown back in the list, only usable at submit/edit time; if a "why did I request this" display is wanted later, that needs the detail DTO, out of scope here.
3. `LeaveRequestStatus`: `Pending, Accepted, Rejected, DelayRequested` (exact casing).
4. `src/shared/hooks/use-employee-lookup.ts` (Story 04) — `currentEmployeeId` splits the one fetched list into "My Requests" vs "Approver Queue" client-side; `getName(id)` resolves `RequesterId`/`ApproverEmployeeId` to a display name in the approver queue and (for the approver name) in "My Requests".
5. `src/features/tasks/components/reject-task-dialog.tsx`, `reassign-task-dialog.tsx` (Story 02) — the exact dialog+form shape this story's reject/request-delay dialogs mirror.
6. `src/features/tasks/components/task-form.tsx`'s `Calendar`+`Popover` due-date recipe — reused for `StartDate`/`EndDate` (submit/edit form) and `TargetDate` (request-delay dialog).

## Frontend Tasks

`No backend changes required.`

### 1 — `leaveKeys`

**File: `src/lib/query-keys.ts`** — append:
```ts
export const leaveKeys = {
  all: ["leaves"] as const,
  lists: () => [...leaveKeys.all, "list"] as const,
};
```
Flat (no `detail(id)`) — no detail route in this story.

### 2 — Types and schemas

**Create file: `src/features/leaves/types/leave.types.ts`** — `LeaveRequest{id, requesterId, startDate, endDate, status: LeaveRequestStatus, approverEmployeeId: number|null}`, `CreateLeaveRequest{startDate, endDate, reason}` (also used for edit), `RejectLeaveRequest{reason}`, `RequestDelayRequest{targetDate, reason}`.

**Create files**:
- `schemas/leave-request.schema.ts` — `buildLeaveRequestSchema(t)`: `startDate`/`endDate: z.string().min(1,...)`, `reason: z.string().trim().min(1,...)`, refined so `endDate >= startDate` (mirrors `signup.schema.ts`'s cross-field `.refine` precedent).
- `schemas/reject-leave.schema.ts` — `reason` required.
- `schemas/request-delay.schema.ts` — `targetDate` required string, `reason` required.

### 3 — Hooks

- `hooks/use-leaves.ts` — `GET /api/leaves`.
- `hooks/use-create-leave.ts`, `use-update-leave.ts` (`PATCH /api/leaves/{id}`), `use-delete-leave.ts` (`DELETE /api/leaves/{id}`) — all invalidate `leaveKeys.lists()`.
- `hooks/use-accept-leave.ts`, `use-reject-leave.ts`, `use-request-delay-leave.ts` — all invalidate `leaveKeys.lists()`. None touch `employeeKeys` — unlike Tasks, no attendance-recalculation side effect exists anywhere in the Leaves backend code.

### 4 — Components

- `components/leave-status-badge.tsx` — `Pending`→outline, `Accepted`→default, `Rejected`→destructive, `DelayRequested`→secondary.
- `components/leave-request-dialog.tsx` — shared create/edit `Dialog`+form (`startDate`/`endDate` via `Calendar`+`Popover` recipe ×2, `reason` via `Textarea`); takes an optional `leave` prop to switch between create (`useCreateLeave`) and edit (`useUpdateLeave`) mode, mirroring how `task-form.tsx` is create-only but this one genuinely needs both — the two flows are identical fields with only the submit target differing, so one dialog beats two near-duplicate ones.
- `components/reject-leave-dialog.tsx`, `components/request-delay-dialog.tsx` — same shape as Story 02's `reject-task-dialog.tsx`.
- `components/my-requests-list.tsx` — table (Start/End/Status/Approver-name-if-any), Edit/Delete row actions gated to `status === "Pending"` (ownership is already guaranteed — see Story Goal point 1).
- `components/approver-queue-list.tsx` — table (Requester name/Start/End/Status), Accept/Reject/Request-Delay row actions gated to `status === "Pending"` only (see the accepted rank-filtering limitation above — no further client-side gating).

### 5 — Page

**Create file: `src/app/[locale]/(dashboard)/leaves/page.tsx`**:
```
My Requests                                    [Submit request]
<table or empty state>

Approver Queue                                  (only if useHasRole("Admin","Manager","Supervisor"))
<table or empty state>
```
`Submit request` button visible via `useHasRole("Employee","Manager","Supervisor")` (Admin excluded — cannot submit). Both sections read from one `useLeaves()` call, split via `leave.requesterId === currentEmployeeId`.

### 6 — Nav + translations

**File: `(dashboard)/layout.tsx`** — add a `Leaves` link, visible unconditionally (every role needs either "My Requests" or "Approver Queue" or both).

**Files: `messages/en.json`/`ar.json`** — `nav.leaves`, `enums.leaveRequestStatus.{Pending,Accepted,Rejected,DelayRequested}`, a `leaves` namespace (`myRequests`, `approverQueue`, `fields`, `create`, `actions` incl. reject/delay dialogs). **Avoid `<...>` in any message string** — Story 04 hit a real `next-intl` parse failure (`UNCLOSED_TAG`) from a literal `<date>` inside a plain string; use plain words or `{name}`-style ICU placeholders only when the calling `t()` actually supplies that variable.

## Edge Cases

- **Admin viewing "My Requests"** — always empty (Admin can't submit), and the `Submit request` button is hidden for them — not a bug, just Admin's literal role in this workflow.
- **Editing/deleting past the `Pending` window** — the row's own action buttons already disappear once status changes (client-side, from the same status the backend enforces), so the 403/400 the backend would otherwise return is normally unreachable from this UI.
- **Rank-check rejection** (see Story Goal's accepted limitation) — surfaces as a generic error toast; no attempt to pre-explain "you can't action this" beyond what the backend's own error communicates.
- **`endDate` before `startDate`** — blocked client-side by the schema's cross-field refinement before ever reaching the backend.

## Test Plan

1. As an Employee, submit a request; confirm it appears under "My Requests" with `Pending`; edit it (change dates/reason); delete it.
2. As a Supervisor, submit a request, then log in as a Manager and confirm it appears in the Manager's Approver Queue; Accept it; confirm status flips to `Accepted` and the row's action buttons disappear.
3. Reject (with reason) and Request-Delay (date+reason) on two more `Pending` requests as a privileged role; confirm both dialogs work and the resulting status/fields are correct.
4. Attempt (if reachable — e.g. a Supervisor trying to action a Manager's request, which the UI will still show a button for per the accepted limitation) an out-of-rank action; confirm a clean error toast, no crash.
5. Confirm Admin never sees a `Submit request` button and their own "My Requests" section is empty.
6. Regression: Stories 01–04.

## Verification Steps

1. `npm run build` && `npm run lint`.
2. Manual browser walkthrough of the Test Plan.

## Done Criteria

- [ ] `leaveKeys` + `src/features/leaves/` implemented end-to-end.
- [ ] `/leaves` implemented with both sections, correct role gating, and all six actions (create/edit/delete/accept/reject/request-delay).
- [ ] Nav shows `Leaves` for everyone.
- [ ] `en.json`/`ar.json` updated, no `<...>` landmines.
- [ ] Manual Test Plan passes.

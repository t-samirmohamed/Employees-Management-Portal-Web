# Story 07 — Leave Request Notifications

## Prerequisites

- Story 01 (`roles`), Story 05 (`leaves` — the deep-link target). Backend contract (`EmpoloyeeManagment/Endpoints/NotificationEndpoints.cs`, `Dtos/Notifications/NotificationDtos.cs`) already extracted during initial research (Context item 1).

## Story Goal

1. A notification bell in the dashboard nav (Admin/Manager/Supervisor only — the doc names only these roles as recipients) with an unread-count badge, opening a `Popover` list (reusing the `popover` primitive already installed in Story 04).
2. Polling (`refetchInterval`, no websocket — intake explicitly says keep it simple) keeps the badge current without a manual refresh.
3. Clicking a notification marks it read and navigates to `/leaves`, **with the specific request scrolled-to and highlighted** — a small addition beyond the intake's literal "deep-links to the relevant leave request in the approver queue": since the `leaves` feature (Story 05) has no per-request detail route, a bare link to `/leaves` would satisfy the letter but not the spirit of "deep-link to the relevant one." A `?requestId=` param plus a scroll-into-view + highlight in `ApproverQueueList` gets the reader to the actual row, not just the right page.

**Known, accepted limitation (already documented in the overall initiative plan): this UI will show nothing in practice.** The backend's `INotificationService.NotifyLeaveRequestSubmittedAsync` exists but `POST /api/leaves` doesn't call it yet (confirmed backend-side gap, `EmpoloyeeManagment/CLAUDE.md`). Building this now is still correct — it's a complete, correct client for the API surface that exists today; wiring the trigger is backend work out of scope for a frontend-only initiative.

## Context — Read These Files First

1. **Backend contract** (`EmpoloyeeManagment/Endpoints/NotificationEndpoints.cs`, `Dtos/Notifications/NotificationDtos.cs`, extracted in full during initial research): `GET /api/notifications/` — always self-scoped to the caller (`RecipientUserId == callerUserId`), **even for Admin** — no privileged "see all" branch exists, ordered `CreatedAt desc`, no query params. `PATCH /api/notifications/{id}/read` — 404 unless the notification exists and belongs to the caller. `NotificationDto(Id, Type: NotificationType, ReferenceId, IsRead, CreatedAt)`. `NotificationType` has exactly one member today: `LeaveRequestSubmitted`. `ReferenceId` is a bare `int` — for this one type, it's a `LeaveRequest.Id`.
2. `src/app/[locale]/(dashboard)/leaves/page.tsx`, `src/features/leaves/components/approver-queue-list.tsx` (Story 05) — the deep-link target; task 5 adds a `highlightId` prop threaded from the page's `?requestId=` search param down to the matching row.
3. `src/components/ui/popover.tsx` (installed Story 04) — reused as-is for the bell's dropdown, no new shadcn primitive needed.
4. `src/app/[locale]/(dashboard)/layout.tsx` — where the bell is added, alongside the existing attendance badge (Story 06)/theme toggle/language switcher.

## Frontend Tasks

`No backend changes required` (the known limitation above is accepted, not fixed here).

### 1 — `notificationKeys`

**File: `src/lib/query-keys.ts`** — append:
```ts
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
};
```

### 2 — Types

**Create file: `src/features/notifications/types/notification.types.ts`**:
```ts
export type NotificationType = "LeaveRequestSubmitted";

export type Notification = {
  id: number;
  type: NotificationType;
  referenceId: number;
  isRead: boolean;
  createdAt: string;
};
```

### 3 — Hooks

**Create file: `src/features/notifications/hooks/use-notifications.ts`**:
```ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { notificationKeys } from "@/lib/query-keys";
import type { Notification } from "@features/notifications/types/notification.types";

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: () => apiClient.get<Notification[]>("/api/notifications"),
    refetchInterval: 30_000, // simple poll — intake explicitly rules out websocket work
  });
}
```

**Create file: `src/features/notifications/hooks/use-mark-notification-read.ts`** — `PATCH /api/notifications/{id}/read`, invalidates `notificationKeys.lists()`.

### 4 — Notification bell

**Create file: `src/features/notifications/components/notification-bell.tsx`**:
- `Popover`+`PopoverTrigger` (a `Button variant="ghost" size="icon"` with a `Bell` icon from `lucide-react`, and a small count badge — reuse `Badge` — absolutely positioned top-right of the bell, shown only when `unreadCount > 0`, capped display at `9+`).
- `PopoverContent`: list of notifications (newest first, already ordered by the backend), each row showing a translated message for its `type` (only `LeaveRequestSubmitted` exists — `t("notifications.messages.LeaveRequestSubmitted")`), a relative-ish timestamp (`date-fns`'s `formatDistanceToNow`, already a project dependency since Story 02), and unread rows visually distinguished (e.g. a dot or bold weight — not a separate badge component, keep it simple).
- Click a row: `useMarkNotificationRead().mutate(id)` (fire-and-forget style — don't block navigation on it completing) then `router.push(`/leaves?requestId=${referenceId}`)`, closing the popover.
- Empty state: a plain "no notifications" message inside the popover.

### 5 — Deep-link highlight in the approver queue

**File: `src/app/[locale]/(dashboard)/leaves/page.tsx`** — read `requestId` from `useSearchParams()`, pass as `highlightId` (parsed to a number, or `null`) to `ApproverQueueList`.

**File: `src/features/leaves/components/approver-queue-list.tsx`** — accept an optional `highlightId?: number | null`; the matching row gets a `ref` that scrolls into view (`useEffect` + `scrollIntoView({ block: "center" })`) on mount when `highlightId` is set, plus a temporary highlight background class (e.g. `bg-accent`, no auto-dismiss timer needed — it's fine for the highlight to persist until the user navigates away, simpler than adding a fade-out timer for a one-shot visual cue).

### 6 — Wire into the nav

**File: `src/app/[locale]/(dashboard)/layout.tsx`** — add `<NotificationBell />` next to the attendance badge, gated by `useHasRole("Admin", "Manager", "Supervisor")`.

### 7 — Translations

`notifications` namespace (`bell.empty`, `messages.LeaveRequestSubmitted`) in `en.json`/`ar.json`.

## Edge Cases

- **`referenceId` pointing at a leave request the viewer can no longer see** (e.g., already actioned by someone else) — the approver queue still lists it (terminal-status rows render, just without action buttons, per Story 05's own design) — the highlight still finds and scrolls to it; nothing breaks.
- **Marking read fails** (network blip) — the mutation's own error doesn't block navigation (task 4's "fire-and-forget" framing) — worst case the item still shows unread next poll, not a broken flow.
- **No notifications ever created** (the accepted backend-gap limitation) — bell shows a 0-badge (or no badge) and the popover's empty state — a fully correct, quiet UI, not an error state.

## Test Plan

1. Manually insert a `Notifications` row via direct DB access for a test Admin/Manager/Supervisor account (since the backend never creates one on its own yet) with `Type=LeaveRequestSubmitted` and a real `ReferenceId` pointing at an existing pending leave request; confirm the bell shows an unread badge.
2. Open the popover, confirm the row renders with a translated message and timestamp; click it; confirm it navigates to `/leaves?requestId=...`, the matching approver-queue row is scrolled into view and highlighted, and the notification is now marked read (badge count drops, re-opening the popover shows it unbolded).
3. Confirm the bell is absent for an Employee account.
4. Regression: Stories 01–06.

## Verification Steps

1. `npm run build` && `npm run lint`.
2. Manual browser walkthrough of the Test Plan (including the direct-DB-insert step, since the backend has no way to create a notification through its own API yet).

## Done Criteria

- [x] `notificationKeys` + `src/features/notifications/` implemented end-to-end.
- [x] Bell + unread badge + popover list, gated to Admin/Manager/Supervisor, polling every 30s.
- [x] Click marks read and deep-links to the specific leave request (scroll + highlight), not just the page.
- [x] `en.json`/`ar.json` updated.
- [x] Manual Test Plan passes (using a manually-inserted test row, since the trigger isn't wired backend-side).

## Addendum — backend triggers wired, notification set expanded (superseding several items above)

The "known, accepted limitation" this story shipped with (§ Story Goal point 3, § Context item 1, § Edge Cases, § Test Plan) has been resolved: the user explicitly requested extending the backend (a one-time, deliberate exception to this initiative's otherwise-strict "backend is read-only reference" rule) to notify assignees/requesters about task/visit assignment and leave decisions, not just leave submission.

**Backend changes** (`EmpoloyeeManagment`, outside this repo but documented here since it changes this story's contract):
- `Models/Enums.cs`'s `NotificationType` grew from one member to six: `LeaveRequestSubmitted`, `LeaveRequestAccepted`, `LeaveRequestRejected`, `LeaveRequestDelayRequested`, `TaskAssigned`, `VisitAssigned`.
- `INotificationService`/`NotificationService` gained one method per new type (all funneling through a shared private `CreateNotificationsAsync` helper — the original single-purpose method's try/catch/insert logic, generalized).
- `LeaveEndpoints.CreateLeaveRequestAsync` now actually calls `NotifyLeaveRequestSubmittedAsync` (previously unwired — the DTO/route existed but nothing ever triggered it). Recipients are computed via a new `GetEligibleApproverUserIdsAsync` helper: every employee whose role outranks the requester's, per the same rank table `CanActionLeaveRequest` already used for authorization — i.e., exactly the people actually allowed to action the request, not a hardcoded "all Admins" list. `AcceptLeaveRequestAsync`/`RejectLeaveRequestAsync`/`RequestDelayAsync` each now notify the requester with the matching type.
- `TaskEndpoints.CreateTaskAsync` and `ReassignTaskAsync` now notify the (new) assignee with `TaskAssigned`.
- `VisitEndpoints.CreateVisitAsync` notifies the assignee with `VisitAssigned` — deliberately not also firing `TaskAssigned` for the auto-created driving task, since that task is an implementation detail of the visit from the recipient's point of view.
- Verified live (signup a fresh Employee account, submit/accept/reject/delay leave requests, create/reassign a task, create a visit, all via direct API calls) plus a SQL check of the `Notifications` table confirming exactly the expected rows/recipients for every trigger, including the rank-based fan-out (a Manager's own submission correctly notified only Admins, not Supervisors/Managers).

**Frontend changes** (this repo):
- `src/features/notifications/types/notification.types.ts` — `NotificationType` is now the 6-member union above (was 1).
- `src/features/notifications/components/notification-bell.tsx` — `messageFor`/`linkFor` extended with a case per new type. Task/Visit notifications deep-link to `/tasks/{referenceId}` / `/visits/{referenceId}`; the three leave-decision types deep-link to `/leaves?myRequestId={referenceId}` (a **new** search param, distinct from the existing `?requestId=` used for the approver queue — see next point) since their recipient is the original requester, not an approver.
- `src/features/leaves/components/my-requests-list.tsx` — gained the same `highlightId?: number | null` + scroll-into-view + `bg-accent` treatment `approver-queue-list.tsx` already had, for symmetry (a requester now needs their own row found and highlighted, not just an approver's).
- `src/app/[locale]/(dashboard)/leaves/page.tsx` — reads the new `?myRequestId=` param, passes it to `MyRequestsList`.
- **`src/app/[locale]/(dashboard)/layout.tsx`'s nav gate widened**: `canSeeNotifications` was `["Admin", "Manager", "Supervisor"]` (correct at the time — the only notification type was leave-submission, which never targets an Employee). With `TaskAssigned`/`VisitAssigned`/leave-decision types added, an Employee is now a legitimate recipient, so the gate grew to include `"Employee"` — found and fixed while browser-verifying this exact extension (an Employee test account had unread notifications but no bell to see them).
- `en.json`/`ar.json` — `notifications.messages` gained one key per new type.

**Edge Cases §, revised**: "No notifications ever created" no longer applies — all six triggers are live. The `referenceId`-points-at-something-the-viewer-can-no-longer-see case is now also possible for `TaskAssigned` (task reassigned away before the original assignee opens the notification — confirmed live: correctly 404s via the existing task ownership check, not a broken link) in addition to the original leave-request case.

**Out of scope, not addressed by this addendum**: per-device/granular notification preferences, marking all-read in bulk, and a real-time push (still polling every 30s) — none of these were asked for.

# Story 02 — Task Management & Assignment Workflow

## Prerequisites

- Story 01 completed: [`../roles/01-story-role-gating-and-admin-user-management.md`](../roles/01-story-role-gating-and-admin-user-management.md) — this story depends directly on `useAuth()`'s `role` field and the `useHasRole`/`RequireRole` primitives it introduced. Verified in the current codebase: `src/features/auth/lib/auth-context.tsx` (role/userId), `src/features/auth/lib/use-has-role.ts`, `src/features/auth/components/require-role.tsx`.
- Backend companion story already shipped: `EmpoloyeeManagment` repo, `Endpoints/TaskEndpoints.cs` + `Dtos/Tasks/TaskDtos.cs` — full contract extracted below (Context item 3).
- This story also builds the shared calendar/kanban view-mode infrastructure the (not-yet-planned) `visits` story will reuse — see `.squad/stories/tasks/task-management-assignment-workflow/intake.md`'s Dependencies section and `.squad/stories/visits/visit-tracking-status/intake.md`. Do not duplicate `src/shared/components/view-modes/` when planning `visits` — extend it.

## Story Goal

Give every role a working view of Tasks and the actions their role permits:

1. Three view modes (list / calendar / kanban) over one underlying `GET /api/tasks` query, switched via a URL-persisted toggle (`?view=list|calendar|kanban`, default `list`) — same shareable-URL pattern as the employees list's filters.
2. Task detail: all fields, a read-only computed status badge, and comments (add always; edit/delete gated to the comment's own author or an Admin).
3. Supervisor/Manager/Admin (`TaskAssigner`): create a task, reassign a task's assignee.
4. Employee: accept or reject (with a required reason) their own assigned task — the backend already guarantees a plain Employee can only ever load a task they're assigned to (see Context item 3's `CanViewTaskAsync`), so the frontend needs no separate "is this my task" check to show these two buttons.
5. Supervisor/Manager/Admin: cancel (from New/InProgress) or complete (from InProgress) any task.

**Explicitly deferred** (documented gaps, not oversights):
- **Attachments** — the intake's acceptance criteria list upload/list/delete, but the backend has no attachment endpoints yet (`EmpoloyeeManagment/CLAUDE.md`'s "Known v1 gaps": task attachments "still out of scope"; a *pending, unimplemented* backend plan exists at `.squad/plans/tasks/03-story-task-attachments.md` in that repo). Nothing to build against — left out and flagged, not half-built.
- **Related-visit picker** on the create-task form — `Visits` doesn't exist on the frontend until Story 04. `RelatedVisitId` is optional server-side, so tasks are simply created without one for now; a follow-up once `visits` ships adds the picker.
- **Kanban drag is constrained to role-valid, input-free transitions only** — see Edge Cases. There is no generic "set status" endpoint; every status change is a named action with its own role gate (and Reject needs a reason, which a bare drag can't supply).

---

## Context — Read These Files First

1. `src/features/auth/lib/auth-context.tsx`, `use-has-role.ts`, `components/require-role.tsx` — the role-gating primitives this story consumes throughout. `useAuth().session?.email` (already existed pre-Story-01, unchanged) is what this story uses to resolve "am I this comment's author" — see task 9.
2. `src/features/employees/hooks/use-employees.ts`, `types/employee.types.ts` — this story imports `useEmployees({})` directly (the first deliberate cross-feature hook import in this codebase). Justified: Employee is a shared reference entity that an assignee picker, a name-lookup for `AssigneeId`/`AuthorEmployeeId`, and the current-user's-own-employee-id resolution all need — duplicating the fetch-and-key logic a second time (and a third, in `visits`) would be worse than one import. `EmployeeListItem` has no `email`-to-`Employee.Id` shortcut on the backend for a non-Admin caller, which is exactly why this story resolves "my own employee id" by matching `session.email` against this list instead (Context item 3 confirms `GET /api/employees` is available to any authenticated role, unlike `GET /api/users` which is Admin-only).
3. **Backend contract, verified by reading `Endpoints/TaskEndpoints.cs` and `Dtos/Tasks/TaskDtos.cs` in full** (`EmpoloyeeManagment` repo):
   - Routes: `GET /api/tasks/` (any authenticated; Employee sees only `AssigneeId == caller`, others see all), `GET /api/tasks/{id}` (404 if `CanViewTaskAsync` fails: `IsPrivileged(Admin/Manager/Supervisor) || caller.Id == task.AssigneeId`), `POST /api/tasks/` (`TaskAssigner`), `PATCH /api/tasks/{id}` (`TaskAssigner`, reassign only), `PATCH /api/tasks/{id}/accept|reject` (`EmployeeOnly`, own task, else 404), `PATCH /api/tasks/{id}/cancel|complete` (`TaskAssigner`), `POST /api/tasks/{id}/comments` (anyone who can view), `PATCH|DELETE /api/tasks/{id}/comments/{commentId}` (author or Admin, else **403**).
   - `CreateTaskRequest(Name:string, DueDateTime:DateTime, AssigneeId:int, RelatedVisitId:int?, Notes:string?, AttendanceRequired:bool)`; `ReassignTaskRequest(NewAssigneeId:int)`; `RejectTaskRequest(Reason:string)`; `AddCommentRequest(Text:string)`; `UpdateCommentRequest(Text:string)`.
   - `TaskListItemDto(Id, Name, DueDateTime, AssigneeId, RelatedVisitId, Status, AttendanceRequired)`; `TaskDetailDto` adds `Notes, RejectionReason, CreatedAt`; `TaskCommentDto(Id, AuthorEmployeeId, Text, CreatedAt, UpdatedAt)`; `GET /{id}` wraps as `TaskDetailResponse(Task, Comments: TaskCommentDto[])` — every mutation returns the bare `TaskDetailDto` (create/comment-create are `201`).
   - `TaskItemStatus`: `New, InProgress, Rejected, Cancelled, Done` (exact casing, serialized as strings).
   - Validation the frontend must anticipate as server error responses (not re-implemented client-side beyond disabling obviously-invalid actions): create 404s an unknown `AssigneeId`; reassign 400s if current status is `Done`/`Cancelled`; accept/reject 400 if not `New`; accept 400s "This employee already has another accepted visit that isn't done yet." if the assignee already holds another `InProgress` visit-linked task (irrelevant until `visits` ships — no task created by this story ever has `RelatedVisitId` set); reject 400s an empty `Reason`; cancel 400s unless `New`/`InProgress`; complete 400s unless `InProgress`; add-comment 400s empty `Text`.
4. `src/lib/api-client.ts`, `src/lib/query-keys.ts` — `apiClient.get/post/patch` call shape and the `employeeKeys`/`statisticsKeys`/`userKeys` factory pattern this story extends with `taskKeys`.
5. `src/features/employees/` (whole feature) — the file-per-concern convention (`types/`, `schemas/`, `hooks/` one-per-endpoint, `components/`) this story's `src/features/tasks/` mirrors, and `src/app/[locale]/(dashboard)/employees/{page,new/page}.tsx` — the page-structure precedent for `tasks`' three pages.
6. `src/features/users/` (whole feature, from Story 01) — the most recent precedent for a brand-new feature folder plus a `RequireRole`-gated page; `tasks`' list/detail pages are **not** role-restricted (any authenticated user can view, per Context item 3), only the create/reassign/cancel/complete/accept/reject **actions** are — don't wrap the list/detail pages themselves in `RequireRole`.
7. `package.json` — confirms `date-fns@4.4.0`, `react-day-picker@9.14.0`, `@dnd-kit/core@6.3.1` + `@dnd-kit/sortable@10.0.0` + `@dnd-kit/utilities@3.2.2` now installed (this story's own first task), and shadcn `calendar`/`popover`/`textarea`/`checkbox` added to `src/components/ui/` (their generated `cn` import needed a manual fix to `@/lib/utils` — the registry emitted a broken bare `"cn"` import; already corrected, verify it stays correct if these files are ever regenerated).

---

## Product rules (from story)

| Area | Current behavior | New behavior |
|---|---|---|
| `/tasks` | Doesn't exist | List (any authenticated, row-scoped by backend), 3 view modes |
| `/tasks/new` | Doesn't exist | Create, `TaskAssigner` only |
| `/tasks/{id}` | Doesn't exist | Detail + comments + role-appropriate actions |
| Nav | Employees / Statistics / (Users if Admin) | Adds `Tasks`, visible to everyone (any authenticated role can see the list) |
| `src/shared/components/view-modes/` | Doesn't exist | New: list/calendar/kanban substrate, generic over a minimal item shape |
| `src/shared/types/enums.ts` | `Gender`/`EmployeeStatus`/`AttendanceStatus`/`Role` | Adds `TaskItemStatus` |

---

## Frontend Tasks

`No backend changes required` — the full Tasks API already exists and was read directly from source (Context item 3).

### 1 — Packages and shadcn primitives (done)

Already installed as the first step of this story: `date-fns`, `react-day-picker@^9`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (npm), and `calendar`, `popover`, `textarea`, `checkbox` (shadcn CLI, added to `src/components/ui/`, `cn` import corrected). No further action here.

### 2 — Add `TaskItemStatus` to shared enums

**File: `src/shared/types/enums.ts`** — append:

```ts
export type TaskItemStatus = "New" | "InProgress" | "Rejected" | "Cancelled" | "Done";
```

### 3 — Shared view-mode substrate

**Create file: `src/shared/components/view-modes/types.ts`**

```ts
export type ViewMode = "list" | "calendar" | "kanban";

export type ScheduledItem = {
  id: number;
  title: string;
  date: string; // ISO datetime — the field each feature groups/sorts by
  statusKey: string; // column/badge grouping key (e.g. TaskItemStatus)
  href: string; // detail-page link
};
```

**Create file: `src/shared/components/view-modes/view-mode-toggle.tsx`** — three-button group (reuse `Button` primitive, `variant={mode === active ? "default" : "outline"}`), controlled component: `{ value: ViewMode; onChange: (mode: ViewMode) => void }`. No new primitive needed (`tabs` was considered and rejected — a 3-button group is simpler than pulling in a whole new shadcn primitive for one toggle).

**Create file: `src/shared/components/view-modes/calendar-month-view.tsx`**

```tsx
"use client";

import { useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, endOfWeek, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { ScheduledItem } from "@/shared/components/view-modes/types";

export function CalendarMonthView({ items, statusColor }: {
  items: ScheduledItem[];
  statusColor: (statusKey: string) => string; // returns a Tailwind class for the chip
}) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const gridStart = startOfWeek(startOfMonth(month));
  const gridEnd = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setMonth((m) => subMonths(m, 1))}>‹</Button>
        <span className="text-sm font-medium">{format(month, "MMMM yyyy")}</span>
        <Button variant="outline" size="sm" onClick={() => setMonth((m) => addMonths(m, 1))}>›</Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {days.map((day) => {
          const dayItems = items.filter((item) => isSameDay(new Date(item.date), day));
          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 rounded-md border p-1 ${isSameMonth(day, month) ? "" : "opacity-40"}`}
            >
              <div className="text-muted-foreground">{format(day, "d")}</div>
              <div className="flex flex-col gap-1">
                {dayItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`truncate rounded px-1 py-0.5 text-white ${statusColor(item.statusKey)}`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

Deliberately hand-rolled with `date-fns`, not `react-day-picker` — `react-day-picker` is a date-*selection* widget (one value in, one value out), not a content-per-day renderer; forcing an agenda view through it would fight its API rather than simplify anything. `react-day-picker` (via the new `calendar`+`popover` shadcn components) is reserved for the create-task form's due-date **input** (task 8), a genuinely different need.

**Create file: `src/shared/components/view-modes/kanban-board.tsx`**

```tsx
"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { Link } from "@/i18n/navigation";
import type { ScheduledItem } from "@/shared/components/view-modes/types";

export type KanbanColumn = { key: string; label: string };

function KanbanCard({ item }: { item: ScheduledItem }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10 } : undefined}
      className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm active:cursor-grabbing"
    >
      <Link href={item.href} className="hover:underline" onClick={(e) => transform && e.preventDefault()}>
        {item.title}
      </Link>
    </div>
  );
}

function KanbanColumnDropZone({ column, items }: { column: KanbanColumn; items: ScheduledItem[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });
  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-48 flex-col gap-2 rounded-md border p-2 ${isOver ? "bg-accent" : ""}`}
    >
      <h3 className="text-sm font-medium">{column.label}</h3>
      {items.map((item) => (
        <KanbanCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function KanbanBoard({
  columns,
  items,
  onDrop,
}: {
  columns: KanbanColumn[];
  items: ScheduledItem[];
  onDrop: (itemId: number, fromStatus: string, toStatus: string) => void;
}) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const item = items.find((i) => i.id === active.id);
    if (!item) return;
    const toStatus = String(over.id);
    if (toStatus === item.statusKey) return;
    onDrop(Number(active.id), item.statusKey, toStatus);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {columns.map((column) => (
          <KanbanColumnDropZone
            key={column.key}
            column={column}
            items={items.filter((item) => item.statusKey === column.key)}
          />
        ))}
      </div>
    </DndContext>
  );
}
```

**Critical design point — no local drag state, no optimistic column reshuffle**: `KanbanBoard` derives each column's cards directly from the `items` prop (server data via React Query) on every render — it holds **no** local "which column is this card in" state. `onDrop` is a plain callback; the CALLER (task 12's `task-kanban-view.tsx`) decides whether the dragged transition is valid for the current user's role and, if so, fires the matching mutation; if invalid, it simply does nothing. Either way, the card's rendered column is only ever a function of the current query data — an invalid or rejected drop needs no manual "snap back," because nothing about the source data changed, so the next render (which happens immediately, since dnd-kit's drag preview is transient) already shows the card in its original column. This is simpler and more robust than reconciling optimistic local state against an async mutation result.

### 4 — `taskKeys` query-key factory

**File: `src/lib/query-keys.ts`** — append:

```ts
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: () => [...taskKeys.lists()] as const, // no server-side filters today — one shared list cache entry
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
};
```

### 5 — Tasks feature: types

**Create file: `src/features/tasks/types/task.types.ts`**

```ts
import type { TaskItemStatus } from "@shared/types/enums";

export type TaskListItem = {
  id: number;
  name: string;
  dueDateTime: string;
  assigneeId: number;
  relatedVisitId: number | null;
  status: TaskItemStatus;
  attendanceRequired: boolean;
};

export type TaskDetail = TaskListItem & {
  notes: string | null;
  rejectionReason: string | null;
  createdAt: string;
};

export type TaskComment = {
  id: number;
  authorEmployeeId: number;
  text: string;
  createdAt: string;
  updatedAt: string | null;
};

export type TaskDetailResponse = {
  task: TaskDetail;
  comments: TaskComment[];
};

export type CreateTaskRequest = {
  name: string;
  dueDateTime: string;
  assigneeId: number;
  notes?: string;
  attendanceRequired: boolean;
};

export type ReassignTaskRequest = { newAssigneeId: number };
export type RejectTaskRequest = { reason: string };
export type AddCommentRequest = { text: string };
export type UpdateCommentRequest = { text: string };
```

### 6 — Tasks feature: schemas

**Create file: `src/features/tasks/schemas/create-task.schema.ts`**

```ts
import { z } from "zod";

export const buildCreateTaskSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(1, t("validation.required")),
    dueDate: z.string().min(1, t("validation.required")), // yyyy-MM-dd from the calendar popover
    dueTime: z.string().min(1, t("validation.required")), // HH:mm from a plain time input
    assigneeId: z.coerce.number().int().positive(t("validation.required")),
    notes: z.string().trim().optional(),
    attendanceRequired: z.boolean(),
  });

export type CreateTaskInput = z.infer<ReturnType<typeof buildCreateTaskSchema>>;
```

Date and time are kept as two separate form fields (matching the two separate shadcn inputs — a `Calendar`+`Popover` date picker and a plain `<Input type="time">`) and combined into one ISO `DueDateTime` string only at submit time (task 12), rather than fighting a single combined-datetime form control that doesn't exist as a shadcn primitive.

**Create file: `src/features/tasks/schemas/reject-task.schema.ts`**

```ts
import { z } from "zod";

export const buildRejectTaskSchema = (t: (key: string) => string) =>
  z.object({ reason: z.string().trim().min(1, t("validation.required")) });

export type RejectTaskInput = z.infer<ReturnType<typeof buildRejectTaskSchema>>;
```

**Create file: `src/features/tasks/schemas/comment.schema.ts`**

```ts
import { z } from "zod";

export const buildCommentSchema = (t: (key: string) => string) =>
  z.object({ text: z.string().trim().min(1, t("validation.required")) });

export type CommentInput = z.infer<ReturnType<typeof buildCommentSchema>>;
```

### 7 — Tasks feature: hooks (one per endpoint, matching the `employees` convention)

**Create file: `src/features/tasks/hooks/use-tasks.ts`** — `useQuery({ queryKey: taskKeys.list(), queryFn: () => apiClient.get<TaskListItem[]>("/api/tasks") })`.

**Create file: `src/features/tasks/hooks/use-task.ts`** — `useQuery({ queryKey: taskKeys.detail(id), queryFn: () => apiClient.get<TaskDetailResponse>(`/api/tasks/${id}`), enabled: Number.isFinite(id) })`.

**Create file: `src/features/tasks/hooks/use-employee-lookup.ts`**

```ts
import { useEmployees } from "@features/employees/hooks/use-employees";
import { useAuth } from "@features/auth/lib/auth-context";

export function useEmployeeLookup() {
  const { data: employees } = useEmployees({});
  const { session } = useAuth();

  const byId = new Map((employees ?? []).map((e) => [e.id, e]));
  const currentEmployee = (employees ?? []).find((e) => e.email === session?.email) ?? null;

  return {
    getName: (id: number) => {
      const e = byId.get(id);
      return e ? `${e.firstName} ${e.lastName}` : `#${id}`;
    },
    employees: employees ?? [],
    currentEmployeeId: currentEmployee?.id ?? null,
  };
}
```

Resolves both "display name for an id" (list/kanban/calendar chips, comment authors) and "which Employee.Id am I" (comment-ownership gating, task 13) from one shared `useEmployees({})` call — React Query dedupes the underlying request regardless of how many components call this hook.

**Create files, one per remaining endpoint** (mutation hooks; each invalidates `taskKeys.detail(id)` — via `setQueryData` where the response already has the full updated `TaskDetailDto` — and `taskKeys.lists()`, matching `use-activate-employee.ts`'s two-cache-update shape):
- `use-create-task.ts` — `POST /api/tasks`, input `CreateTaskRequest → TaskDetail`.
- `use-reassign-task.ts` — `PATCH /api/tasks/{id}`, input `{id, newAssigneeId}`.
- `use-accept-task.ts` — `PATCH /api/tasks/{id}/accept`, input `id` only.
- `use-reject-task.ts` — `PATCH /api/tasks/{id}/reject`, input `{id, reason}`.
- `use-cancel-task.ts` — `PATCH /api/tasks/{id}/cancel`, input `id` only.
- `use-complete-task.ts` — `PATCH /api/tasks/{id}/complete`, input `id` only.
- `use-add-comment.ts` — `POST /api/tasks/{id}/comments`, invalidates `taskKeys.detail(id)` only (comments live inside the detail response, not the list).
- `use-update-comment.ts` — `PATCH /api/tasks/{id}/comments/{commentId}`, invalidates `taskKeys.detail(id)`.
- `use-delete-comment.ts` — `DELETE /api/tasks/{id}/comments/{commentId}`, invalidates `taskKeys.detail(id)`.

Example (`use-accept-task.ts`, the shape every simple action mutation follows):

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { taskKeys } from "@/lib/query-keys";
import type { TaskDetail } from "@features/tasks/types/task.types";

export function useAcceptTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.patch<TaskDetail>(`/api/tasks/${id}/accept`),
    onSuccess: (data, id) => {
      queryClient.setQueryData(taskKeys.detail(id), (prev: { task: TaskDetail; comments: unknown } | undefined) =>
        prev ? { ...prev, task: data } : prev
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
```

### 8 — Status badge and view-model mapping

**Create file: `src/features/tasks/components/task-status-badge.tsx`** — same shape as `enum-badge.tsx`'s `StatusBadge`, one variant/color per `TaskItemStatus` (`New`→outline, `InProgress`→default, `Rejected`/`Cancelled`→destructive-ish (`secondary`, since no `destructive` badge variant is confirmed to exist — check `badge.tsx`'s actual variants before using one not already there), `Done`→default-muted). Also export a plain `taskStatusColorClass(status: TaskItemStatus): string` (Tailwind background classes, e.g. `bg-slate-500`/`bg-blue-500`/`bg-red-500`/`bg-gray-400`/`bg-green-600`) for the calendar/kanban chip backgrounds (task 3's `statusColor` prop).

**Create file: `src/features/tasks/lib/to-scheduled-item.ts`**

```ts
import type { ScheduledItem } from "@/shared/components/view-modes/types";
import type { TaskListItem } from "@features/tasks/types/task.types";

export function taskToScheduledItem(task: TaskListItem, getName: (id: number) => string): ScheduledItem {
  return {
    id: task.id,
    title: `${task.name} · ${getName(task.assigneeId)}`,
    date: task.dueDateTime,
    statusKey: task.status,
    href: `/tasks/${task.id}`,
  };
}
```

### 9 — List / calendar / kanban view components

**Create file: `src/features/tasks/components/task-list-view.tsx`** — plain `Table` (same structure as `employees/page.tsx`'s table): columns Name, Due date (`format(new Date(task.dueDateTime), "PPp")` via `date-fns`), Assignee (`getName(task.assigneeId)`), Status (`TaskStatusBadge`), row links to `/tasks/{id}`.

**Create file: `src/features/tasks/components/task-calendar-view.tsx`** — thin wrapper: maps `TaskListItem[]` through `taskToScheduledItem`, renders `<CalendarMonthView items={...} statusColor={taskStatusColorClass} />`.

**Create file: `src/features/tasks/components/task-kanban-view.tsx`** — the one component with real logic:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { KanbanBoard, type KanbanColumn } from "@/shared/components/view-modes/kanban-board";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useAcceptTask } from "@features/tasks/hooks/use-accept-task";
import { useCancelTask } from "@features/tasks/hooks/use-cancel-task";
import { useCompleteTask } from "@features/tasks/hooks/use-complete-task";
import { taskToScheduledItem } from "@features/tasks/lib/to-scheduled-item";
import type { TaskListItem } from "@features/tasks/types/task.types";
import { toast } from "sonner";

const COLUMNS: KanbanColumn[] = [
  { key: "New", label: "New" }, // labels come from t("enums.taskItemStatus.*") in the real file
  { key: "InProgress", label: "In progress" },
  { key: "Rejected", label: "Rejected" },
  { key: "Cancelled", label: "Cancelled" },
  { key: "Done", label: "Done" },
];

export function TaskKanbanView({
  tasks,
  getName,
  currentEmployeeId,
  onRequestReject,
}: {
  tasks: TaskListItem[];
  getName: (id: number) => string;
  currentEmployeeId: number | null;
  onRequestReject: (taskId: number) => void; // opens the same reason dialog the explicit Reject button uses
}) {
  const t = useTranslations();
  const isTaskAssigner = useHasRole("Admin", "Manager", "Supervisor");
  const accept = useAcceptTask();
  const cancel = useCancelTask();
  const complete = useCompleteTask();

  function handleDrop(taskId: number, from: string, to: string) {
    const task = tasks.find((x) => x.id === taskId);
    if (!task) return;

    if (from === "New" && to === "InProgress" && task.assigneeId === currentEmployeeId) {
      accept.mutate(taskId, { onError: () => toast.error(t("errors.generic")) });
    } else if (from === "New" && to === "Rejected" && task.assigneeId === currentEmployeeId) {
      onRequestReject(taskId);
    } else if (isTaskAssigner && (from === "New" || from === "InProgress") && to === "Cancelled") {
      cancel.mutate(taskId, { onError: () => toast.error(t("errors.generic")) });
    } else if (isTaskAssigner && from === "InProgress" && to === "Done") {
      complete.mutate(taskId, { onError: () => toast.error(t("errors.generic")) });
    }
    // Any other transition: no-op. The board re-renders from unchanged query
    // data, so the card is already back where it started — no manual revert needed.
  }

  return (
    <KanbanBoard
      columns={COLUMNS}
      items={tasks.map((task) => taskToScheduledItem(task, getName))}
      onDrop={handleDrop}
    />
  );
}
```

`onRequestReject` is a callback into the page (task 11), which owns the reject-reason dialog shared with the explicit Reject button on the detail page — a drag-initiated reject and a button-initiated reject end up calling the exact same `useRejectTask()` mutation with the exact same dialog, just triggered from two different places.

### 10 — Comments UI

**Create file: `src/features/tasks/components/task-comments.tsx`** — list (author name via `getName`, timestamp, edited-indicator if `updatedAt`), an always-visible add-comment form (`buildCommentSchema`), and per-comment edit/delete controls shown only when `isAdmin || comment.authorEmployeeId === currentEmployeeId` (props passed in from the detail page, task 11). Edit is inline (textarea replaces the text + save/cancel); delete uses the same confirm-`Dialog` pattern as `employee-row-actions.tsx`.

### 11 — Task form (create) and reassign/reject dialogs

**Create file: `src/features/tasks/components/task-form.tsx`** — create-only (reassign is a separate, much simpler dialog, per Context item 3: `PATCH` only ever changes `AssigneeId`). Fields: Name (`Input`), due date (`Popover`+`Calendar`, per the shadcn recipe) + due time (`Input type="time"`), Assignee (`Select`, options from `useEmployeeLookup().employees`), Notes (`Textarea`, optional), Attendance required (`Checkbox`). On submit, combine `dueDate`+`dueTime` into one ISO string (`` `${dueDate}T${dueTime}:00` ``) before calling `useCreateTask()`.

**Create file: `src/features/tasks/components/reassign-task-dialog.tsx`** — `Dialog` wrapping a single `Select` (assignee) + submit, calling `useReassignTask()`.

**Create file: `src/features/tasks/components/reject-task-dialog.tsx`** — `Dialog` wrapping `buildRejectTaskSchema`'s single `reason` field, calling `useRejectTask()`. Takes `open`/`onOpenChange`/`taskId` props so both the detail page's explicit Reject button and the kanban view's drag-to-Rejected (task 9) can drive the same dialog.

### 12 — Pages

**Create file: `src/app/[locale]/(dashboard)/tasks/page.tsx`** — reads `?view=` from `useSearchParams` (default `"list"`), `useTasks()` + `useEmployeeLookup()`, renders `ViewModeToggle` + the matching view component; `Add task` button (`Link href="/tasks/new"`) visible only via `useHasRole("Admin","Manager","Supervisor")` (`TaskAssigner`'s exact role set — no dedicated hook needed, `useHasRole` already takes a role list).

**Create file: `src/app/[locale]/(dashboard)/tasks/new/page.tsx`** — wraps `TaskForm` in `<RequireRole roles={["Admin","Manager","Supervisor"]}>` (mirrors Story 01's `/users/new`, but with 3 roles instead of 1 — `RequireRole`'s `roles` prop already supports this).

**Create file: `src/app/[locale]/(dashboard)/tasks/[id]/page.tsx`** — `useTask(id)` + `useEmployeeLookup()`; renders all `TaskDetail` fields, `TaskStatusBadge`, and:
- Accept/Reject buttons when `role === "Employee" && task.status === "New"` (no extra ownership check needed — see Story Goal point 4).
- Reassign button + `ReassignTaskDialog` when `useHasRole("Admin","Manager","Supervisor")` and `status` isn't `Done`/`Cancelled`.
- Cancel button when `TaskAssigner` and status is `New`/`InProgress`.
- Complete button when `TaskAssigner` and status is `InProgress`.
- `TaskComments`, passing `isAdmin={useHasRole("Admin")}` and `currentEmployeeId` from `useEmployeeLookup()`.

### 13 — Nav link

**File: `src/app/[locale]/(dashboard)/layout.tsx`** — add a `Tasks` link after `Employees`, visible unconditionally (any authenticated role can see the tasks list, per Context item 3 — no `useHasRole` gate needed here, unlike the Users link).

### 14 — Translations

**Files: `messages/en.json`, `messages/ar.json`** — add `nav.tasks`, `enums.taskItemStatus.{New,InProgress,Rejected,Cancelled,Done}`, and a full `tasks` namespace (`list`, `fields`, `create`, `detail`, `actions`, `comments` sub-keys) mirroring `employees`'/`users`' shape.

---

## Edge Cases & Failure Modes

- **Employee viewing their own task detail is guaranteed to be the assignee** (Context item 3: `CanViewTaskAsync` 404s otherwise) — this is why Accept/Reject don't need a separate ownership check, but it also means if this invariant were ever relaxed backend-side, this frontend assumption would silently become wrong; not expected to change (documented here so it isn't re-derived incorrectly later).
- **Comment ownership requires resolving "my own Employee.Id" client-side** — done via `session.email` matched against `GET /api/employees` (any authenticated role can call this endpoint), *not* via `GET /api/users` (Admin-only, would 403 for everyone else). If `useEmployeeLookup()`'s employees query hasn't loaded yet, `currentEmployeeId` is `null` and every comment's edit/delete controls are hidden (fail closed) until it resolves.
- **Invalid kanban drag** (wrong role, wrong from/to pair, or dragging someone else's task) — `handleDrop` no-ops; no toast, no error — the card was never optimistically moved, so there's nothing to revert.
- **Reject via kanban drag, then the reason dialog is cancelled** — the task's status is untouched (the mutation never fired), so the kanban board's next render (from unchanged data) still shows the card in the `New` column.
- **Reassigning a task that's `Done`/`Cancelled`** — the Reassign button is hidden client-side per its status check (task 12), but if the button somehow renders and is clicked anyway (stale data), the backend's own 400 surfaces via a generic error toast — no special-case handling needed beyond the mutation's default `onError`.
- **Concurrent status change** (e.g., a Supervisor cancels a task the moment its assignee accepts it) — whichever request the backend processes second gets its own 400 from the backend's state check; the frontend doesn't attempt optimistic-conflict resolution, it just surfaces that error and lets the user re-fetch (query invalidation on the *successful* mutation already keeps the rest of the UI consistent).
- **`getName(id)` for an id not present in the current employees list** (extremely unlikely — every `AssigneeId`/`AuthorEmployeeId` originates from a real `Employee` row — but defensively) falls back to `#<id>` rather than crashing.
- **`react-day-picker` + RTL (Arabic locale)** — the generated `calendar.tsx` already includes RTL chevron-flip classes (`rtl:**:[.rdp-button_next>svg]:rotate-180` etc., visible in the file as generated) — no extra work needed here, but worth a manual check in the Test Plan since this is the first time this codebase renders a `react-day-picker` calendar under `dir="rtl"`.

---

## Test Plan

No test framework exists in this repo; verification is manual, browser-based, using the throwaway accounts already created for Story 01 plus new ones as needed for each role.

1. **List + view modes** — as any role, `/tasks` shows the list view by default; switching to calendar/kanban updates `?view=` and renders the same underlying tasks in each mode; an Employee sees only their own tasks in all three modes (row-scoping happens server-side, so this should already just work once the shared query is correct).
2. **Create** — as a Supervisor/Manager/Admin, `/tasks/new` creates a task with a valid assignee, date, and time; confirm the combined `dueDateTime` round-trips correctly (check the created task's due date/time on the detail page matches what was picked). As an Employee, confirm `/tasks/new` redirects away.
3. **Accept/Reject** — as the assignee Employee, open the task detail, Accept; confirm status becomes `InProgress` and the buttons disappear. Create a second task, Reject with an empty reason (blocked client-side by the schema) then a real reason; confirm status becomes `Rejected` and the reason is visible on the detail page.
4. **Reassign** — as Admin, reassign an `InProgress` task to a different employee; confirm status resets to `New` and the new assignee sees it in their own list.
5. **Cancel/Complete** — as Admin, cancel a `New` task and complete an `InProgress` one; confirm both buttons respect their status preconditions (hidden/absent otherwise).
6. **Comments** — add a comment as two different roles on the same task; confirm each can edit/delete only their own, and that logging in as Admin allows editing/deleting *either* comment.
7. **Kanban drag** — as the assignee Employee, drag a card from New→InProgress (should Accept) and separately New→Rejected (should open the reason dialog); as Admin, drag InProgress→Done (should Complete). Attempt an invalid drag (e.g., Employee dragging Done→New) and confirm nothing happens and no error is thrown.
8. **RTL check** — switch locale to Arabic, open the calendar view; confirm the month grid and the create-task date picker render sensibly (chevrons pointing the correct direction).
9. **Regression** — Story 01's full walkthrough (Admin/Employee nav gating, Users list/create) and the pre-existing `employees`/`statistics`/`auth` flows still work.

---

## Verification Steps

1. **Frontend builds:** `npm run build` and `npm run lint` from `employee-management-web/`.
2. **Backend runs:** `dotnet run --project EmpoloyeeManagment` (already running locally throughout this session).
3. **Frontend runs:** `npm run dev`; walk through the Test Plan above for at least an Admin and an Employee account.
4. **Regression:** confirm Story 01's screens and the pre-existing employees/statistics/auth flows still work.

---

## Done Criteria

- [ ] `src/shared/components/view-modes/` (types, toggle, calendar, kanban) implemented and generic enough for `visits` to reuse without modification.
- [ ] `TaskItemStatus` added to shared enums; `taskKeys` added to the shared query-key factory.
- [ ] `src/features/tasks/` implemented end-to-end: types, schemas, one hook per endpoint, list/calendar/kanban view components, comments, create form, reassign/reject dialogs.
- [ ] `/tasks`, `/tasks/new`, `/tasks/{id}` implemented with the exact role/ownership gating described above.
- [ ] Kanban drag limited to role-valid, input-free transitions; reject-via-drag reuses the same dialog as the explicit button.
- [ ] Nav shows `Tasks` for every authenticated role.
- [ ] `en.json`/`ar.json` updated and mirrored.
- [ ] Full manual Test Plan (steps 1–9) passes against a local run.

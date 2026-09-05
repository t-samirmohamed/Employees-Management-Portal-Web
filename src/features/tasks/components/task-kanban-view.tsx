"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { KanbanBoard, type KanbanColumn } from "@/shared/components/view-modes/kanban-board";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useAcceptTask } from "@features/tasks/hooks/use-accept-task";
import { useCancelTask } from "@features/tasks/hooks/use-cancel-task";
import { useCompleteTask } from "@features/tasks/hooks/use-complete-task";
import { taskToScheduledItem } from "@features/tasks/lib/to-scheduled-item";
import type { TaskListItem } from "@features/tasks/types/task.types";

const STATUS_KEYS = ["New", "InProgress", "Rejected", "Cancelled", "Done"] as const;

export function TaskKanbanView({
  tasks,
  getName,
  currentEmployeeId,
  onRequestReject,
}: {
  tasks: TaskListItem[];
  getName: (id: number) => string;
  currentEmployeeId: number | null;
  onRequestReject: (taskId: number) => void;
}) {
  const t = useTranslations();
  const isTaskAssigner = useHasRole("Admin", "Manager", "Supervisor");
  const accept = useAcceptTask();
  const cancel = useCancelTask();
  const complete = useCompleteTask();

  const columns: KanbanColumn[] = STATUS_KEYS.map((key) => ({
    key,
    label: t(`enums.taskItemStatus.${key}`),
  }));

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
    // Any other transition: no-op — the board re-renders from unchanged query
    // data, so the card is already back where it started.
  }

  return (
    <KanbanBoard
      columns={columns}
      items={tasks.map((task) => taskToScheduledItem(task, getName))}
      onDrop={handleDrop}
    />
  );
}

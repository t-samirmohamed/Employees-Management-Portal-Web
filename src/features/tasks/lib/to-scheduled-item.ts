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

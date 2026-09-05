"use client";

import { CalendarMonthView } from "@/shared/components/view-modes/calendar-month-view";
import { taskStatusColorClass } from "@features/tasks/components/task-status-badge";
import { taskToScheduledItem } from "@features/tasks/lib/to-scheduled-item";
import type { TaskListItem } from "@features/tasks/types/task.types";

export function TaskCalendarView({
  tasks,
  getName,
}: {
  tasks: TaskListItem[];
  getName: (id: number) => string;
}) {
  return (
    <CalendarMonthView
      items={tasks.map((task) => taskToScheduledItem(task, getName))}
      statusColor={taskStatusColorClass}
    />
  );
}

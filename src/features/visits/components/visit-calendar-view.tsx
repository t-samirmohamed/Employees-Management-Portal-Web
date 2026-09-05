"use client";

import { CalendarMonthView } from "@/shared/components/view-modes/calendar-month-view";
import { taskStatusColorClass } from "@features/tasks/components/task-status-badge";
import { visitToScheduledItem } from "@features/visits/lib/to-scheduled-item";
import type { VisitListItem } from "@features/visits/types/visit.types";

export function VisitCalendarView({
  visits,
  getClientName,
  getEmployeeName,
}: {
  visits: VisitListItem[];
  getClientName: (id: number) => string;
  getEmployeeName: (id: number) => string;
}) {
  return (
    <CalendarMonthView
      items={visits.map((visit) => visitToScheduledItem(visit, getClientName, getEmployeeName))}
      statusColor={taskStatusColorClass}
    />
  );
}

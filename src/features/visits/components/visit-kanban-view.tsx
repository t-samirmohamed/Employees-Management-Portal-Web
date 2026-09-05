"use client";

import { useTranslations } from "next-intl";
import { KanbanBoard, type KanbanColumn } from "@/shared/components/view-modes/kanban-board";
import { visitToScheduledItem } from "@features/visits/lib/to-scheduled-item";
import type { VisitListItem } from "@features/visits/types/visit.types";

const STATUS_KEYS = ["New", "InProgress", "Rejected", "Cancelled", "Done"] as const;

// Read-only: a visit's status is entirely inherited from its linked task, and
// there is no visit-level action endpoint — changing status happens on the
// task detail page (linked from the visit detail page), not by dragging here.
export function VisitKanbanView({
  visits,
  getClientName,
  getEmployeeName,
}: {
  visits: VisitListItem[];
  getClientName: (id: number) => string;
  getEmployeeName: (id: number) => string;
}) {
  const t = useTranslations();

  const columns: KanbanColumn[] = STATUS_KEYS.map((key) => ({
    key,
    label: t(`enums.taskItemStatus.${key}`),
  }));

  return (
    <KanbanBoard
      columns={columns}
      items={visits.map((visit) => visitToScheduledItem(visit, getClientName, getEmployeeName))}
      readOnly
    />
  );
}

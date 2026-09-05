import type { ScheduledItem } from "@/shared/components/view-modes/types";
import type { VisitListItem } from "@features/visits/types/visit.types";

export function visitToScheduledItem(
  visit: VisitListItem,
  getClientName: (id: number) => string,
  getEmployeeName: (id: number) => string
): ScheduledItem {
  return {
    id: visit.id,
    title: `${getClientName(visit.clientId)} · ${getEmployeeName(visit.assigneeId)}`,
    date: visit.dateTime,
    statusKey: visit.status,
    href: `/visits/${visit.id}`,
  };
}

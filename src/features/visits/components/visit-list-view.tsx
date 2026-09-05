"use client";

import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskStatusBadge } from "@features/tasks/components/task-status-badge";
import type { VisitListItem } from "@features/visits/types/visit.types";

export function VisitListView({
  visits,
  getClientName,
  getEmployeeName,
}: {
  visits: VisitListItem[];
  getClientName: (id: number) => string;
  getEmployeeName: (id: number) => string;
}) {
  const t = useTranslations("visits.fields");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("dateTime")}</TableHead>
          <TableHead>{t("client")}</TableHead>
          <TableHead>{t("location")}</TableHead>
          <TableHead>{t("assignee")}</TableHead>
          <TableHead>{t("status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visits.map((visit) => (
          <TableRow key={visit.id}>
            <TableCell>
              <Link href={`/visits/${visit.id}`} className="hover:underline">
                {format(new Date(visit.dateTime), "PPp")}
              </Link>
            </TableCell>
            <TableCell>{getClientName(visit.clientId)}</TableCell>
            <TableCell>#{visit.locationId}</TableCell>
            <TableCell>{getEmployeeName(visit.assigneeId)}</TableCell>
            <TableCell>
              <TaskStatusBadge value={visit.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

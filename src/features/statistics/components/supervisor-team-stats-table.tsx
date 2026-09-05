"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupervisorTeamStats } from "@features/statistics/hooks/use-supervisor-team-stats";

export function SupervisorTeamStatsTable() {
  const t = useTranslations("statistics.supervisorTeams");
  const tAttendance = useTranslations("enums.attendanceStatus");
  const { data, isLoading } = useSupervisorTeamStats();

  function formatBreakdown(breakdown: Record<string, number>): string {
    const entries = Object.entries(breakdown);
    return entries.length === 0
      ? "—"
      : entries.map(([key, count]) => `${tAttendance(key)}: ${count}`).join(", ");
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">{t("title")}</h2>
      {isLoading || !data ? (
        <Skeleton className="h-32 w-full" />
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noResults")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("supervisor")}</TableHead>
              <TableHead>{t("client")}</TableHead>
              <TableHead>{t("teamSize")}</TableHead>
              <TableHead>{t("openTasks")}</TableHead>
              <TableHead>{t("attendance")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.supervisorEmployeeId}>
                <TableCell>{row.supervisorName}</TableCell>
                <TableCell>{row.assignedClientName ?? "—"}</TableCell>
                <TableCell>{row.teamEmployeeIds.length}</TableCell>
                <TableCell>{row.openTaskCount}</TableCell>
                <TableCell>{formatBreakdown(row.teamAttendanceStatusBreakdown)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

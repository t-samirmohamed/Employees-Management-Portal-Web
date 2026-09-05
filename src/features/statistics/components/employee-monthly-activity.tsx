"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendanceBadge } from "@features/employees/components/enum-badge";
import { useEmployeeMonthlyActivity } from "@features/statistics/hooks/use-employee-monthly-activity";
import { StatusPieChart } from "@features/statistics/components/status-pie-chart";
import type { AttendanceStatus } from "@shared/types/enums";

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export function EmployeeMonthlyActivity({ employeeId }: { employeeId: number }) {
  const t = useTranslations("statistics.monthlyActivity");
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { data, isLoading, isError } = useEmployeeMonthlyActivity(employeeId, year, month);

  const years = [year - 1, year, year + 1];

  return (
    <Card className="max-w-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <div className="flex gap-2">
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {new Date(2000, m - 1, 1).toLocaleString(undefined, { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : isError || !data ? (
          <p className="text-sm text-muted-foreground">{t("notAvailable")}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("totalTasks")}</span>
                <span className="font-medium">{data.totalTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("totalVisits")}</span>
                <span className="font-medium">{data.totalVisits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("currentAttendance")}</span>
                <AttendanceBadge value={data.currentAttendanceStatus as AttendanceStatus} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("attendanceDrivingTasks")}</span>
                <span className="font-medium">{data.attendanceDrivingTaskCount}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <StatusPieChart title={t("tasksByStatus")} counts={data.tasksByStatus} />
              <StatusPieChart title={t("visitsByStatus")} counts={data.visitsByStatus} />
            </div>
            <p className="text-xs text-muted-foreground">{t("leavesNote")}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

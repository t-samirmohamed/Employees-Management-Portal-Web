"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeStatistics } from "@features/statistics/hooks/use-employee-statistics";

type EnumNamespace = "gender" | "status" | "attendanceStatus";

function BreakdownCard({
  title,
  counts,
  labelNamespace,
}: {
  title: string;
  counts: Record<string, number>;
  labelNamespace: EnumNamespace;
}) {
  const tEnums = useTranslations("enums");
  const entries = Object.entries(counts);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">—</p>
        ) : (
          entries.map(([key, count]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{tEnums(`${labelNamespace}.${key}`)}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function StatisticsPage() {
  const t = useTranslations("statistics");
  const { data, isLoading } = useEmployeeStatistics();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>

      {isLoading || !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("totalEmployees")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{data.totalEmployees}</p>
            </CardContent>
          </Card>
          <BreakdownCard title={t("byGender")} counts={data.byGender} labelNamespace="gender" />
          <BreakdownCard title={t("byStatus")} counts={data.byStatus} labelNamespace="status" />
          <BreakdownCard
            title={t("byAttendanceStatus")}
            counts={data.byAttendanceStatus}
            labelNamespace="attendanceStatus"
          />
        </div>
      )}
    </div>
  );
}

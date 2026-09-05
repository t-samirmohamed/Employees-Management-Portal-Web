"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useEmployeeStatistics } from "@features/statistics/hooks/use-employee-statistics";
import { BreakdownCard } from "@features/statistics/components/breakdown-card";
import { StatusStatsCard } from "@features/statistics/components/status-stats-card";
import { MostVisitedClientsCard } from "@features/statistics/components/most-visited-clients-card";
import { SupervisorTeamStatsTable } from "@features/statistics/components/supervisor-team-stats-table";

export default function StatisticsPage() {
  const t = useTranslations("statistics");
  const { data, isLoading } = useEmployeeStatistics();
  const canSeeStatusStats = useHasRole("Admin", "Manager", "Supervisor");
  const canSeeClientStats = useHasRole("Admin", "Manager");

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

      {canSeeStatusStats && <StatusStatsCard />}
      {canSeeClientStats && <MostVisitedClientsCard />}
      {canSeeClientStats && <SupervisorTeamStatsTable />}
    </div>
  );
}

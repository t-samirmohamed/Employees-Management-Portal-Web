"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { useStatusStats } from "@features/statistics/hooks/use-status-stats";
import { StatusPieChart } from "@features/statistics/components/status-pie-chart";

export function StatusStatsCard() {
  const t = useTranslations("statistics");
  const { data, isLoading } = useStatusStats();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">{t("statusStats.title")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatusPieChart title={t("statusStats.tasksByStatus")} counts={data.tasksByStatus} />
        <StatusPieChart title={t("statusStats.visitsByStatus")} counts={data.visitsByStatus} />
      </div>
    </div>
  );
}

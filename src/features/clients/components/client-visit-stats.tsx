"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientVisitStats } from "@features/clients/hooks/use-client-visit-stats";

const RANGES = ["month", "3month", "6month", "year"] as const;
type Range = (typeof RANGES)[number];

export function ClientVisitStats({ clientId }: { clientId: number }) {
  const t = useTranslations("clients.visitStats");
  const [range, setRange] = useState<Range>("month");
  const { data, isLoading } = useClientVisitStats(clientId, range);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1">
          {RANGES.map((r) => (
            <Button
              key={r}
              type="button"
              size="sm"
              variant={r === range ? "default" : "outline"}
              onClick={() => setRange(r)}
            >
              {t(`ranges.${r}`)}
            </Button>
          ))}
        </div>
        {isLoading || !data ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <p className="text-3xl font-semibold">{data.visitCount}</p>
        )}
      </CardContent>
    </Card>
  );
}

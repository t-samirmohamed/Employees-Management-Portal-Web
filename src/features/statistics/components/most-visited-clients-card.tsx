"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useMostVisitedClients } from "@features/statistics/hooks/use-most-visited-clients";

const RANGES = ["month", "3month", "6month", "year"] as const;
type Range = (typeof RANGES)[number];

export function MostVisitedClientsCard() {
  const t = useTranslations("statistics.mostVisitedClients");
  const [range, setRange] = useState<Range>("month");
  const { data, isLoading } = useMostVisitedClients(range);

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
          <Skeleton className="h-32 w-full" />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noResults")}</p>
        ) : (
          <ol className="flex flex-col gap-2 text-sm">
            {data.map((client, index) => (
              <li key={client.clientId} className="flex items-center justify-between">
                <span>
                  {index + 1}.{" "}
                  <Link href={`/clients/${client.clientId}`} className="hover:underline">
                    {client.clientName}
                  </Link>
                </span>
                <span className="font-medium">{client.visitCount}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

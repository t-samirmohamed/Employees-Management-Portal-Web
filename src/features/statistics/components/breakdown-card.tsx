"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type EnumNamespace = "gender" | "status" | "attendanceStatus";

export function BreakdownCard({
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

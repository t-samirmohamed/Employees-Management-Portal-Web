"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@shared/types/enums";

export function RoleBadge({ value }: { value: Role }) {
  const t = useTranslations("enums.role");
  return <Badge variant={value === "Admin" ? "default" : "outline"}>{t(value)}</Badge>;
}

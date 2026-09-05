"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { LeaveRequestStatus } from "@shared/types/enums";

const VARIANT: Record<LeaveRequestStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "outline",
  Accepted: "default",
  Rejected: "destructive",
  DelayRequested: "secondary",
};

export function LeaveStatusBadge({ value }: { value: LeaveRequestStatus }) {
  const t = useTranslations("enums.leaveRequestStatus");
  return <Badge variant={VARIANT[value]}>{t(value)}</Badge>;
}

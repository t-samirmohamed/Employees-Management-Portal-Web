"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus, EmployeeStatus, Gender } from "@shared/types/enums";

export function GenderBadge({ value }: { value: Gender }) {
  const t = useTranslations("enums.gender");
  return <Badge variant="outline">{t(value)}</Badge>;
}

export function StatusBadge({ value }: { value: EmployeeStatus }) {
  const t = useTranslations("enums.status");
  return <Badge variant={value === "Active" ? "default" : "secondary"}>{t(value)}</Badge>;
}

export function AttendanceBadge({ value }: { value: AttendanceStatus }) {
  const t = useTranslations("enums.attendanceStatus");
  return <Badge variant="outline">{t(value)}</Badge>;
}

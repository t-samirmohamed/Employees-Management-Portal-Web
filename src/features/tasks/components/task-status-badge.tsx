"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { TaskItemStatus } from "@shared/types/enums";

const VARIANT: Record<TaskItemStatus, "default" | "secondary" | "destructive" | "outline"> = {
  New: "outline",
  InProgress: "default",
  Rejected: "destructive",
  Cancelled: "secondary",
  Done: "secondary",
};

const COLOR_CLASS: Record<TaskItemStatus, string> = {
  New: "bg-slate-500",
  InProgress: "bg-blue-500",
  Rejected: "bg-red-500",
  Cancelled: "bg-gray-400",
  Done: "bg-green-600",
};

export function taskStatusColorClass(status: string): string {
  return COLOR_CLASS[status as TaskItemStatus] ?? "bg-slate-500";
}

export function TaskStatusBadge({ value }: { value: TaskItemStatus }) {
  const t = useTranslations("enums.taskItemStatus");
  return <Badge variant={VARIANT[value]}>{t(value)}</Badge>;
}

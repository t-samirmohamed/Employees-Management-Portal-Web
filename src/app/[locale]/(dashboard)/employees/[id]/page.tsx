"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useEmployee } from "@features/employees/hooks/use-employee";
import { EmployeeRowActions } from "@features/employees/components/employee-row-actions";
import {
  AttendanceBadge,
  GenderBadge,
  StatusBadge,
} from "@features/employees/components/enum-badge";

export default function EmployeeDetailPage() {
  const t = useTranslations("employees");
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: employee, isLoading, isError } = useEmployee(id);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/employees"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("detail.back")}
      </Link>

      {isLoading ? (
        <Skeleton className="h-64 w-full max-w-lg" />
      ) : isError || !employee ? (
        <p className="text-sm text-muted-foreground">{t("detail.notFound")}</p>
      ) : (
        <Card className="max-w-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {employee.firstName} {employee.lastName}
            </CardTitle>
            <EmployeeRowActions employee={employee} />
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("fields.email")}</span>
              <span>{employee.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("fields.gender")}</span>
              <GenderBadge value={employee.gender} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("fields.status")}</span>
              <StatusBadge value={employee.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("fields.attendanceStatus")}</span>
              <AttendanceBadge value={employee.attendanceStatus} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("fields.createdAt")}</span>
              <span>{new Date(employee.createdAt).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

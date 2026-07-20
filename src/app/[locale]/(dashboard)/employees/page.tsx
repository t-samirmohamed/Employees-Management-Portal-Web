"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmployees } from "@features/employees/hooks/use-employees";
import { parseEmployeeFilters } from "@features/employees/schemas/employee-filters.schema";
import { EmployeeFilters } from "@features/employees/components/employee-filters";
import { EmployeeRowActions } from "@features/employees/components/employee-row-actions";
import { GenderBadge, StatusBadge, AttendanceBadge } from "@features/employees/components/enum-badge";

export default function EmployeesPage() {
  const t = useTranslations("employees");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const filters = parseEmployeeFilters(searchParams);
  const { data: employees, isLoading } = useEmployees(filters);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("list.title")}</h1>
        <Button asChild>
          <Link href="/employees/new">{t("list.createNew")}</Link>
        </Button>
      </div>

      <EmployeeFilters filters={filters} />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : employees && employees.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fields.firstName")}</TableHead>
              <TableHead>{t("fields.lastName")}</TableHead>
              <TableHead>{t("fields.email")}</TableHead>
              <TableHead>{t("fields.gender")}</TableHead>
              <TableHead>{t("fields.status")}</TableHead>
              <TableHead>{t("fields.attendanceStatus")}</TableHead>
              <TableHead className="text-right">{tCommon("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Link href={`/employees/${employee.id}`} className="hover:underline">
                    {employee.firstName}
                  </Link>
                </TableCell>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <GenderBadge value={employee.gender} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={employee.status} />
                </TableCell>
                <TableCell>
                  <AttendanceBadge value={employee.attendanceStatus} />
                </TableCell>
                <TableCell className="text-right">
                  <EmployeeRowActions employee={employee} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground">{t("list.noResults")}</p>
      )}
    </div>
  );
}

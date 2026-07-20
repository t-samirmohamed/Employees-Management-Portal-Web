"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EmployeeFiltersInput } from "@features/employees/schemas/employee-filters.schema";

const ALL = "all";

export function EmployeeFilters({ filters }: { filters: EmployeeFiltersInput }) {
  const t = useTranslations("employees.list.filters");
  const tEnums = useTranslations("enums");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const hasFilters = Boolean(filters.gender || filters.status || filters.attendanceStatus);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={filters.gender ?? ALL} onValueChange={(value) => updateParam("gender", value)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t("gender")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t("allGenders")}</SelectItem>
          <SelectItem value="M">{tEnums("gender.M")}</SelectItem>
          <SelectItem value="F">{tEnums("gender.F")}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status ?? ALL} onValueChange={(value) => updateParam("status", value)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t("status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t("allStatuses")}</SelectItem>
          <SelectItem value="Active">{tEnums("status.Active")}</SelectItem>
          <SelectItem value="Inactive">{tEnums("status.Inactive")}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.attendanceStatus ?? ALL}
        onValueChange={(value) => updateParam("attendanceStatus", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("attendanceStatus")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t("allAttendanceStatuses")}</SelectItem>
          <SelectItem value="InOffice">{tEnums("attendanceStatus.InOffice")}</SelectItem>
          <SelectItem value="Absent">{tEnums("attendanceStatus.Absent")}</SelectItem>
          <SelectItem value="OnVacation">{tEnums("attendanceStatus.OnVacation")}</SelectItem>
          <SelectItem value="OutOfOffice">{tEnums("attendanceStatus.OutOfOffice")}</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
          {t("clear")}
        </Button>
      )}
    </div>
  );
}

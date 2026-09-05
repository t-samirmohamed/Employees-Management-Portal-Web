"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewModeToggle } from "@/shared/components/view-modes/view-mode-toggle";
import type { ViewMode } from "@/shared/components/view-modes/types";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useEmployeeLookup } from "@/shared/hooks/use-employee-lookup";
import { useVisits } from "@features/visits/hooks/use-visits";
import { useClientLookup } from "@features/visits/hooks/use-client-lookup";
import { VisitListView } from "@features/visits/components/visit-list-view";
import { VisitCalendarView } from "@features/visits/components/visit-calendar-view";
import { VisitKanbanView } from "@features/visits/components/visit-kanban-view";

const VIEW_MODES: ViewMode[] = ["list", "calendar", "kanban"];

export default function VisitsPage() {
  const t = useTranslations("visits");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const view: ViewMode = VIEW_MODES.includes(viewParam as ViewMode) ? (viewParam as ViewMode) : "list";

  const { data: visits, isLoading } = useVisits();
  const { getName } = useEmployeeLookup();
  const { getClientName } = useClientLookup();
  const canCreate = useHasRole("Admin", "Manager", "Supervisor");

  function setView(next: ViewMode) {
    const params = new URLSearchParams(searchParams);
    params.set("view", next);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("list.title")}</h1>
        {canCreate && (
          <Button asChild>
            <Link href="/visits/new">{t("list.createNew")}</Link>
          </Button>
        )}
      </div>

      <ViewModeToggle
        value={view}
        onChange={setView}
        labels={{ list: t("views.list"), calendar: t("views.calendar"), kanban: t("views.kanban") }}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : visits && visits.length > 0 ? (
        <>
          {view === "list" && (
            <VisitListView visits={visits} getClientName={getClientName} getEmployeeName={getName} />
          )}
          {view === "calendar" && (
            <VisitCalendarView visits={visits} getClientName={getClientName} getEmployeeName={getName} />
          )}
          {view === "kanban" && (
            <VisitKanbanView visits={visits} getClientName={getClientName} getEmployeeName={getName} />
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{t("list.noResults")}</p>
      )}
    </div>
  );
}

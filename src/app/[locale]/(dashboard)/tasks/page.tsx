"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewModeToggle } from "@/shared/components/view-modes/view-mode-toggle";
import type { ViewMode } from "@/shared/components/view-modes/types";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useTasks } from "@features/tasks/hooks/use-tasks";
import { useEmployeeLookup } from "@features/tasks/hooks/use-employee-lookup";
import { TaskListView } from "@features/tasks/components/task-list-view";
import { TaskCalendarView } from "@features/tasks/components/task-calendar-view";
import { TaskKanbanView } from "@features/tasks/components/task-kanban-view";
import { RejectTaskDialog } from "@features/tasks/components/reject-task-dialog";

const VIEW_MODES: ViewMode[] = ["list", "calendar", "kanban"];

export default function TasksPage() {
  const t = useTranslations("tasks");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const view: ViewMode = VIEW_MODES.includes(viewParam as ViewMode) ? (viewParam as ViewMode) : "list";
  const [rejectTaskId, setRejectTaskId] = useState<number | null>(null);

  function setView(next: ViewMode) {
    const params = new URLSearchParams(searchParams);
    params.set("view", next);
    router.push(`${pathname}?${params.toString()}`);
  }
  const { data: tasks, isLoading } = useTasks();
  const { getName, currentEmployeeId } = useEmployeeLookup();
  const canCreate = useHasRole("Admin", "Manager", "Supervisor");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("list.title")}</h1>
        {canCreate && (
          <Button asChild>
            <Link href="/tasks/new">{t("list.createNew")}</Link>
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
      ) : tasks && tasks.length > 0 ? (
        <>
          {view === "list" && <TaskListView tasks={tasks} getName={getName} />}
          {view === "calendar" && <TaskCalendarView tasks={tasks} getName={getName} />}
          {view === "kanban" && (
            <TaskKanbanView
              tasks={tasks}
              getName={getName}
              currentEmployeeId={currentEmployeeId}
              onRequestReject={setRejectTaskId}
            />
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{t("list.noResults")}</p>
      )}

      <RejectTaskDialog
        taskId={rejectTaskId}
        open={rejectTaskId !== null}
        onOpenChange={(open) => !open && setRejectTaskId(null)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@features/auth/lib/auth-context";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useTask } from "@features/tasks/hooks/use-task";
import { useAcceptTask } from "@features/tasks/hooks/use-accept-task";
import { useCancelTask } from "@features/tasks/hooks/use-cancel-task";
import { useCompleteTask } from "@features/tasks/hooks/use-complete-task";
import { useEmployeeLookup } from "@features/tasks/hooks/use-employee-lookup";
import { TaskStatusBadge } from "@features/tasks/components/task-status-badge";
import { TaskComments } from "@features/tasks/components/task-comments";
import { RejectTaskDialog } from "@features/tasks/components/reject-task-dialog";
import { ReassignTaskDialog } from "@features/tasks/components/reassign-task-dialog";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const t = useTranslations("tasks");
  const tErrors = useTranslations("errors");
  const { role } = useAuth();
  const isTaskAssigner = useHasRole("Admin", "Manager", "Supervisor");
  const isAdmin = useHasRole("Admin");

  const { data, isLoading } = useTask(id);
  const { getName, employees, currentEmployeeId } = useEmployeeLookup();
  const acceptTask = useAcceptTask();
  const cancelTask = useCancelTask();
  const completeTask = useCompleteTask();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">{t("detail.notFound")}</p>;
  }

  const { task, comments } = data;
  const canAcceptReject = role === "Employee" && task.status === "New";
  const canReassign = isTaskAssigner && task.status !== "Done" && task.status !== "Cancelled";
  const canCancel = isTaskAssigner && (task.status === "New" || task.status === "InProgress");
  const canComplete = isTaskAssigner && task.status === "InProgress";

  return (
    <div className="flex flex-col gap-6">
      <Link href="/tasks" className="text-sm text-muted-foreground hover:underline">
        {t("detail.back")}
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{task.name}</h1>
        <TaskStatusBadge value={task.status} />
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">{t("fields.dueDateTime")}</dt>
          <dd>{format(new Date(task.dueDateTime), "PPp")}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("fields.assignee")}</dt>
          <dd>{getName(task.assigneeId)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("fields.attendanceRequired")}</dt>
          <dd>{task.attendanceRequired ? t("fields.yes") : t("fields.no")}</dd>
        </div>
        {task.notes && (
          <div className="col-span-2">
            <dt className="text-muted-foreground">{t("fields.notes")}</dt>
            <dd className="whitespace-pre-wrap">{task.notes}</dd>
          </div>
        )}
        {task.rejectionReason && (
          <div className="col-span-2">
            <dt className="text-muted-foreground">{t("fields.rejectionReason")}</dt>
            <dd className="whitespace-pre-wrap">{task.rejectionReason}</dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap gap-2">
        {canAcceptReject && (
          <>
            <Button
              onClick={() =>
                acceptTask.mutate(task.id, { onError: () => toast.error(tErrors("generic")) })
              }
              disabled={acceptTask.isPending}
            >
              {t("actions.accept")}
            </Button>
            <Button variant="outline" onClick={() => setRejectOpen(true)}>
              {t("actions.reject")}
            </Button>
          </>
        )}
        {canReassign && (
          <Button variant="outline" onClick={() => setReassignOpen(true)}>
            {t("actions.reassign")}
          </Button>
        )}
        {canCancel && (
          <Button
            variant="outline"
            onClick={() =>
              cancelTask.mutate(task.id, { onError: () => toast.error(tErrors("generic")) })
            }
            disabled={cancelTask.isPending}
          >
            {t("actions.cancel")}
          </Button>
        )}
        {canComplete && (
          <Button
            onClick={() =>
              completeTask.mutate(task.id, { onError: () => toast.error(tErrors("generic")) })
            }
            disabled={completeTask.isPending}
          >
            {t("actions.complete")}
          </Button>
        )}
      </div>

      <TaskComments
        taskId={task.id}
        comments={comments}
        getName={getName}
        isAdmin={isAdmin}
        currentEmployeeId={currentEmployeeId}
      />

      <RejectTaskDialog taskId={task.id} open={rejectOpen} onOpenChange={setRejectOpen} />
      <ReassignTaskDialog
        taskId={task.id}
        employees={employees}
        open={reassignOpen}
        onOpenChange={setReassignOpen}
      />
    </div>
  );
}

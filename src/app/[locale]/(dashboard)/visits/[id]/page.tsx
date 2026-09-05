"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeLookup } from "@/shared/hooks/use-employee-lookup";
import { useVisit } from "@features/visits/hooks/use-visit";
import { useClient } from "@features/clients/hooks/use-client";
import { TaskStatusBadge } from "@features/tasks/components/task-status-badge";

export default function VisitDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const t = useTranslations("visits");
  const { data: visit, isLoading } = useVisit(id);
  const { getName } = useEmployeeLookup();
  const { data: client } = useClient(visit?.clientId ?? Number.NaN);

  const location = client?.locations.find((l) => l.id === visit?.locationId);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/visits" className="text-sm text-muted-foreground hover:underline">
        {t("detail.back")}
      </Link>

      {isLoading || !visit ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{format(new Date(visit.dateTime), "PPp")}</h1>
            <TaskStatusBadge value={visit.status} />
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">{t("fields.client")}</dt>
              <dd>
                <Link href={`/clients/${visit.clientId}`} className="hover:underline">
                  {client?.name ?? `#${visit.clientId}`}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("fields.location")}</dt>
              <dd>
                <Link href={`/clients/${visit.clientId}`} className="hover:underline">
                  {location?.name ?? `#${visit.locationId}`}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("fields.assignee")}</dt>
              <dd>{getName(visit.assigneeId)}</dd>
            </div>
          </dl>

          <Link href={`/tasks/${visit.taskId}`} className="text-sm hover:underline">
            {t("detail.viewTask")}
          </Link>
        </>
      )}
    </div>
  );
}

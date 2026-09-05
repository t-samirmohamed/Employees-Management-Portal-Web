"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { RequireRole } from "@features/auth/components/require-role";
import { useClient } from "@features/clients/hooks/use-client";
import { LocationList } from "@features/clients/components/location-list";
import { ClientVisitStats } from "@features/clients/components/client-visit-stats";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const t = useTranslations("clients");
  const { data: client, isLoading } = useClient(id);

  return (
    <RequireRole roles={["Admin", "Manager", "Supervisor"]}>
      <div className="flex flex-col gap-6">
        <Link href="/clients" className="text-sm text-muted-foreground hover:underline">
          {t("detail.back")}
        </Link>

        {isLoading || !client ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <>
            <h1 className="text-2xl font-semibold">{client.name}</h1>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">{t("fields.email")}</dt>
                <dd>{client.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("fields.contact")}</dt>
                <dd>{client.contact}</dd>
              </div>
            </dl>

            <ClientVisitStats clientId={client.id} />

            <div>
              <h2 className="mb-2 text-lg font-semibold">{t("detail.locations")}</h2>
              <LocationList locations={client.locations} />
            </div>
          </>
        )}
      </div>
    </RequireRole>
  );
}

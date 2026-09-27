"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RequireRole } from "@features/auth/components/require-role";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useClient } from "@features/clients/hooks/use-client";
import { useUpdateClient } from "@features/clients/hooks/use-update-client";
import { useAddLocation } from "@features/clients/hooks/use-add-location";
import { LocationList } from "@features/clients/components/location-list";
import { ClientVisitStats } from "@features/clients/components/client-visit-stats";
import { ContactDetailsDialog } from "@features/clients/components/contact-details-dialog";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const t = useTranslations("clients");
  const tErrors = useTranslations("errors");
  const { data: client, isLoading } = useClient(id);
  const canManage = useHasRole("Admin", "Manager");
  const updateClient = useUpdateClient(id);
  const addLocation = useAddLocation(id);
  const [editOpen, setEditOpen] = useState(false);
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const editValues = useMemo(
    () => (client ? { name: client.name, email: client.email, contact: client.contact } : undefined),
    [client]
  );

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
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold">{client.name}</h1>
              {canManage && (
                <Button variant="outline" onClick={() => setEditOpen(true)}>
                  {t("edit.button")}
                </Button>
              )}
            </div>
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
              <div className="mb-2 flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">{t("detail.locations")}</h2>
                {canManage && (
                  <Button variant="outline" size="sm" onClick={() => setAddLocationOpen(true)}>
                    {t("create.addLocation")}
                  </Button>
                )}
              </div>
              <LocationList locations={client.locations} />
            </div>

            {canManage && (
              <>
                <ContactDetailsDialog
                  open={editOpen}
                  onOpenChange={setEditOpen}
                  title={t("edit.title")}
                  submitLabel={t("edit.submit")}
                  initialValues={editValues}
                  isPending={updateClient.isPending}
                  onSubmit={(values) =>
                    updateClient.mutate(values, {
                      onSuccess: () => {
                        toast.success(t("edit.success"));
                        setEditOpen(false);
                      },
                      onError: () => toast.error(tErrors("generic")),
                    })
                  }
                />
                <ContactDetailsDialog
                  open={addLocationOpen}
                  onOpenChange={setAddLocationOpen}
                  title={t("addLocation.title")}
                  submitLabel={t("addLocation.submit")}
                  isPending={addLocation.isPending}
                  onSubmit={(values) =>
                    addLocation.mutate(values, {
                      onSuccess: () => {
                        toast.success(t("addLocation.success"));
                        setAddLocationOpen(false);
                      },
                      onError: () => toast.error(tErrors("generic")),
                    })
                  }
                />
              </>
            )}
          </>
        )}
      </div>
    </RequireRole>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RequireRole } from "@features/auth/components/require-role";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useClients } from "@features/clients/hooks/use-clients";

export default function ClientsPage() {
  const t = useTranslations("clients");
  const { data: clients, isLoading } = useClients();
  const canCreate = useHasRole("Admin", "Manager");

  return (
    <RequireRole roles={["Admin", "Manager", "Supervisor"]}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t("list.title")}</h1>
          {canCreate && (
            <Button asChild>
              <Link href="/clients/new">{t("list.createNew")}</Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : clients && clients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("fields.name")}</TableHead>
                <TableHead>{t("fields.email")}</TableHead>
                <TableHead>{t("fields.contact")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link href={`/clients/${client.id}`} className="hover:underline">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">{t("list.noResults")}</p>
        )}
      </div>
    </RequireRole>
  );
}

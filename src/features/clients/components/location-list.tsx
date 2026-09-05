"use client";

import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Location } from "@features/clients/types/client.types";

export function LocationList({ locations }: { locations: Location[] }) {
  const t = useTranslations("clients.fields");

  if (locations.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("noLocations")}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          <TableHead>{t("email")}</TableHead>
          <TableHead>{t("contact")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.map((location) => (
          <TableRow key={location.id}>
            <TableCell>{location.name}</TableCell>
            <TableCell>{location.email}</TableCell>
            <TableCell>{location.contact}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

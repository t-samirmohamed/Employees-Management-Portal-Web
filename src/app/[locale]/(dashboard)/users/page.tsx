"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RequireRole } from "@features/auth/components/require-role";
import { useUsers } from "@features/users/hooks/use-users";
import { RoleBadge } from "@features/users/components/role-badge";

export default function UsersPage() {
  const t = useTranslations("users");
  const { data: users, isLoading } = useUsers();

  return (
    <RequireRole roles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t("list.title")}</h1>
          <Button asChild>
            <Link href="/users/new">{t("list.createNew")}</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : users && users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("fields.email")}</TableHead>
                <TableHead>{t("fields.role")}</TableHead>
                <TableHead>{t("fields.employee")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge value={user.role} />
                  </TableCell>
                  <TableCell>
                    {user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : "—"}
                  </TableCell>
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

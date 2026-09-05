"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActivateEmployee } from "@features/employees/hooks/use-activate-employee";
import { useDeactivateEmployee } from "@features/employees/hooks/use-deactivate-employee";
import { useHasRole } from "@features/auth/lib/use-has-role";
import type { EmployeeListItem } from "@features/employees/types/employee.types";

export function EmployeeRowActions({ employee }: { employee: EmployeeListItem }) {
  const t = useTranslations("employees.actions");
  const tCommon = useTranslations("common");
  const isAdmin = useHasRole("Admin");
  const [confirmAction, setConfirmAction] = useState<"activate" | "deactivate" | null>(null);
  const activate = useActivateEmployee();
  const deactivate = useDeactivateEmployee();

  const isPending = activate.isPending || deactivate.isPending;

  function handleConfirm() {
    if (confirmAction === "activate") activate.mutate(employee.id);
    if (confirmAction === "deactivate") deactivate.mutate(employee.id);
    setConfirmAction(null);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isAdmin ? (
            employee.status === "Active" ? (
              <DropdownMenuItem onSelect={() => setConfirmAction("deactivate")}>
                {t("deactivate")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={() => setConfirmAction("activate")}>
                {t("activate")}
              </DropdownMenuItem>
            )
          ) : (
            <DropdownMenuItem disabled>{tCommon("noActions")}</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "activate" ? t("confirmActivateTitle") : t("confirmDeactivateTitle")}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "activate"
                ? t("confirmActivateDescription")
                : t("confirmDeactivateDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {tCommon("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useDeleteLeave } from "@features/leaves/hooks/use-delete-leave";
import { LeaveStatusBadge } from "@features/leaves/components/leave-status-badge";
import { LeaveRequestDialog } from "@features/leaves/components/leave-request-dialog";
import type { LeaveRequest } from "@features/leaves/types/leave.types";

export function MyRequestsList({
  requests,
  getName,
  highlightId,
}: {
  requests: LeaveRequest[];
  getName: (id: number) => string;
  highlightId?: number | null;
}) {
  const t = useTranslations("leaves");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const deleteLeave = useDeleteLeave();
  const [editTarget, setEditTarget] = useState<LeaveRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeaveRequest | null>(null);
  useEffect(() => {
    if (highlightId === null || highlightId === undefined) return;
    document.getElementById(`my-request-row-${highlightId}`)?.scrollIntoView({ block: "center" });
  }, [highlightId]);

  function handleDelete() {
    if (!deleteTarget) return;
    deleteLeave.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: () => toast.error(tErrors("generic")),
    });
  }

  if (requests.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("myRequests.noResults")}</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("fields.startDate")}</TableHead>
            <TableHead>{t("fields.endDate")}</TableHead>
            <TableHead>{t("fields.status")}</TableHead>
            <TableHead>{t("fields.approver")}</TableHead>
            <TableHead className="text-right">{tCommon("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((leave) => (
            <TableRow
              key={leave.id}
              id={`my-request-row-${leave.id}`}
              className={leave.id === highlightId ? "bg-accent" : undefined}
            >
              <TableCell>{format(new Date(leave.startDate), "PP")}</TableCell>
              <TableCell>{format(new Date(leave.endDate), "PP")}</TableCell>
              <TableCell>
                <LeaveStatusBadge value={leave.status} />
              </TableCell>
              <TableCell>
                {leave.approverEmployeeId ? getName(leave.approverEmployeeId) : "—"}
              </TableCell>
              <TableCell className="text-right">
                {leave.status === "Pending" && (
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditTarget(leave)}>
                      {t("myRequests.edit")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteTarget(leave)}>
                      {t("myRequests.delete")}
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <LeaveRequestDialog
        leave={editTarget}
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myRequests.confirmDeleteTitle")}</DialogTitle>
            <DialogDescription>{t("myRequests.confirmDeleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleDelete} disabled={deleteLeave.isPending}>
              {tCommon("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

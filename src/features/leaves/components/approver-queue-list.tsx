"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAcceptLeave } from "@features/leaves/hooks/use-accept-leave";
import { LeaveStatusBadge } from "@features/leaves/components/leave-status-badge";
import { RejectLeaveDialog } from "@features/leaves/components/reject-leave-dialog";
import { RequestDelayDialog } from "@features/leaves/components/request-delay-dialog";
import type { LeaveRequest } from "@features/leaves/types/leave.types";

export function ApproverQueueList({
  requests,
  getName,
}: {
  requests: LeaveRequest[];
  getName: (id: number) => string;
}) {
  const t = useTranslations("leaves");
  const tErrors = useTranslations("errors");
  const acceptLeave = useAcceptLeave();
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [delayTarget, setDelayTarget] = useState<number | null>(null);

  if (requests.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("approverQueue.noResults")}</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("fields.requester")}</TableHead>
            <TableHead>{t("fields.startDate")}</TableHead>
            <TableHead>{t("fields.endDate")}</TableHead>
            <TableHead>{t("fields.status")}</TableHead>
            <TableHead className="text-right">{t("approverQueue.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{getName(leave.requesterId)}</TableCell>
              <TableCell>{format(new Date(leave.startDate), "PP")}</TableCell>
              <TableCell>{format(new Date(leave.endDate), "PP")}</TableCell>
              <TableCell>
                <LeaveStatusBadge value={leave.status} />
              </TableCell>
              <TableCell className="text-right">
                {leave.status === "Pending" && (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        acceptLeave.mutate(leave.id, { onError: () => toast.error(tErrors("generic")) })
                      }
                      disabled={acceptLeave.isPending}
                    >
                      {t("actions.accept")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setRejectTarget(leave.id)}>
                      {t("actions.reject")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDelayTarget(leave.id)}>
                      {t("actions.requestDelay")}
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RejectLeaveDialog
        leaveId={rejectTarget}
        open={rejectTarget !== null}
        onOpenChange={(open) => !open && setRejectTarget(null)}
      />
      <RequestDelayDialog
        leaveId={delayTarget}
        open={delayTarget !== null}
        onOpenChange={(open) => !open && setDelayTarget(null)}
      />
    </>
  );
}

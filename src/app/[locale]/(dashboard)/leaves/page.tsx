"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useEmployeeLookup } from "@/shared/hooks/use-employee-lookup";
import { useLeaves } from "@features/leaves/hooks/use-leaves";
import { MyRequestsList } from "@features/leaves/components/my-requests-list";
import { ApproverQueueList } from "@features/leaves/components/approver-queue-list";
import { LeaveRequestDialog } from "@features/leaves/components/leave-request-dialog";

export default function LeavesPage() {
  const t = useTranslations("leaves");
  const searchParams = useSearchParams();
  const requestIdParam = searchParams.get("requestId");
  const highlightId = requestIdParam ? Number(requestIdParam) : null;
  const myRequestIdParam = searchParams.get("myRequestId");
  const myHighlightId = myRequestIdParam ? Number(myRequestIdParam) : null;
  const { data: leaves, isLoading } = useLeaves();
  const { getName, currentEmployeeId } = useEmployeeLookup();
  const canSubmit = useHasRole("Admin", "Employee", "Manager", "Supervisor");
  const isApprover = useHasRole("Admin", "Manager", "Supervisor");
  const [createOpen, setCreateOpen] = useState(false);

  const myRequests = (leaves ?? []).filter((leave) => leave.requesterId === currentEmployeeId);
  const approverQueue = (leaves ?? []).filter((leave) => leave.requesterId !== currentEmployeeId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t("myRequests.title")}</h1>
          {canSubmit && <Button onClick={() => setCreateOpen(true)}>{t("myRequests.submit")}</Button>}
        </div>
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <MyRequestsList requests={myRequests} getName={getName} highlightId={myHighlightId} />
        )}
      </div>

      {isApprover && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{t("approverQueue.title")}</h2>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <ApproverQueueList requests={approverQueue} getName={getName} highlightId={highlightId} />
          )}
        </div>
      )}

      <LeaveRequestDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

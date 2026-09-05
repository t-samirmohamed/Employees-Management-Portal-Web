"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRejectLeave } from "@features/leaves/hooks/use-reject-leave";
import { buildRejectLeaveSchema, type RejectLeaveInput } from "@features/leaves/schemas/reject-leave.schema";

export function RejectLeaveDialog({
  leaveId,
  open,
  onOpenChange,
}: {
  leaveId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("leaves.actions");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const rejectLeave = useRejectLeave();

  const schema = useMemo(() => buildRejectLeaveSchema(tFull), [tFull]);
  const form = useForm<RejectLeaveInput>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "" },
  });

  function onSubmit(values: RejectLeaveInput) {
    if (leaveId === null) return;
    rejectLeave.mutate(
      { id: leaveId, reason: values.reason },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
        onError: () => toast.error(tErrors("generic")),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("rejectTitle")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reason")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={rejectLeave.isPending}>
                {t("reject")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

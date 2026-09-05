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
import { useRejectTask } from "@features/tasks/hooks/use-reject-task";
import { buildRejectTaskSchema, type RejectTaskInput } from "@features/tasks/schemas/reject-task.schema";

export function RejectTaskDialog({
  taskId,
  open,
  onOpenChange,
}: {
  taskId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("tasks.actions");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const rejectTask = useRejectTask();

  const schema = useMemo(() => buildRejectTaskSchema(tFull), [tFull]);
  const form = useForm<RejectTaskInput>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "" },
  });

  function onSubmit(values: RejectTaskInput) {
    if (taskId === null) return;
    rejectTask.mutate(
      { id: taskId, reason: values.reason },
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
                  <FormLabel>{t("rejectReason")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={rejectTask.isPending}>
                {t("reject")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

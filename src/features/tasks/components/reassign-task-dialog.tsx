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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReassignTask } from "@features/tasks/hooks/use-reassign-task";
import {
  buildReassignTaskSchema,
  type ReassignTaskInput,
} from "@features/tasks/schemas/reassign-task.schema";
import type { EmployeeListItem } from "@features/employees/types/employee.types";

export function ReassignTaskDialog({
  taskId,
  employees,
  open,
  onOpenChange,
}: {
  taskId: number;
  employees: EmployeeListItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("tasks.actions");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const reassignTask = useReassignTask();

  const schema = useMemo(() => buildReassignTaskSchema(tFull), [tFull]);
  const form = useForm<ReassignTaskInput>({
    resolver: zodResolver(schema),
    defaultValues: { newAssigneeId: 0 },
  });

  function onSubmit(values: ReassignTaskInput) {
    reassignTask.mutate(
      { id: taskId, newAssigneeId: values.newAssigneeId },
      {
        onSuccess: () => onOpenChange(false),
        onError: () => toast.error(tErrors("generic")),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("reassignTitle")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="newAssigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("assignee")}</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={String(employee.id)}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={reassignTask.isPending}>
                {t("reassign")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

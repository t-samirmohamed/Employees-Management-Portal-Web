"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateLeave } from "@features/leaves/hooks/use-create-leave";
import { useUpdateLeave } from "@features/leaves/hooks/use-update-leave";
import {
  buildLeaveRequestSchema,
  type LeaveRequestInput,
} from "@features/leaves/schemas/leave-request.schema";
import type { LeaveRequest } from "@features/leaves/types/leave.types";

function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useTranslations("leaves.fields");
  const [open, setOpen] = useState(false);
  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant="outline" className="justify-start font-normal">
              <CalendarIcon />
              {value ? format(new Date(value), "PP") : t("pickDate")}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date) onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

export function LeaveRequestDialog({
  leave,
  open,
  onOpenChange,
}: {
  leave?: LeaveRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("leaves");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const createLeave = useCreateLeave();
  const updateLeave = useUpdateLeave();
  const isEditing = Boolean(leave);

  const schema = useMemo(() => buildLeaveRequestSchema(tFull), [tFull]);
  const form = useForm<LeaveRequestInput>({
    resolver: zodResolver(schema),
    defaultValues: { startDate: "", endDate: "", reason: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        startDate: leave?.startDate ?? "",
        endDate: leave?.endDate ?? "",
        reason: "",
      });
    }
  }, [open, leave, form]);

  function onSubmit(values: LeaveRequestInput) {
    const isPending = createLeave.isPending || updateLeave.isPending;
    if (isPending) return;

    const onSuccess = () => {
      toast.success(isEditing ? t("edit.success") : t("create.success"));
      onOpenChange(false);
    };
    const onError = () => toast.error(tErrors("generic"));

    if (isEditing && leave) {
      updateLeave.mutate({ id: leave.id, input: values }, { onSuccess, onError });
    } else {
      createLeave.mutate(values, { onSuccess, onError });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? t("edit.title") : t("create.title")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DatePickerField
                  label={t("fields.startDate")}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <DatePickerField
                  label={t("fields.endDate")}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.reason")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createLeave.isPending || updateLeave.isPending}>
                {isEditing ? t("edit.submit") : t("create.submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

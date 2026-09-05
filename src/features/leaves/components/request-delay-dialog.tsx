"use client";

import { useMemo, useState } from "react";
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
import { useRequestDelayLeave } from "@features/leaves/hooks/use-request-delay-leave";
import {
  buildRequestDelaySchema,
  type RequestDelayInput,
} from "@features/leaves/schemas/request-delay.schema";

export function RequestDelayDialog({
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
  const requestDelay = useRequestDelayLeave();
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const schema = useMemo(() => buildRequestDelaySchema(tFull), [tFull]);
  const form = useForm<RequestDelayInput>({
    resolver: zodResolver(schema),
    defaultValues: { targetDate: "", reason: "" },
  });

  function onSubmit(values: RequestDelayInput) {
    if (leaveId === null) return;
    requestDelay.mutate(
      { id: leaveId, targetDate: values.targetDate, reason: values.reason },
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
          <DialogTitle>{t("requestDelayTitle")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="targetDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("targetDate")}</FormLabel>
                  <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="justify-start font-normal">
                          <CalendarIcon />
                          {field.value ? format(new Date(field.value), "PP") : t("pickDate")}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) field.onChange(format(date, "yyyy-MM-dd"));
                          setDatePopoverOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <Button type="submit" disabled={requestDelay.isPending}>
                {t("requestDelay")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { useCreateTask } from "@features/tasks/hooks/use-create-task";
import { useEmployeeLookup } from "@/shared/hooks/use-employee-lookup";
import { buildCreateTaskSchema, type CreateTaskInput } from "@features/tasks/schemas/create-task.schema";

export function TaskForm() {
  const t = useTranslations("tasks");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const createTask = useCreateTask();
  const { employees } = useEmployeeLookup();

  const schema = useMemo(() => buildCreateTaskSchema(tFull), [tFull]);
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      dueDate: "",
      dueTime: "09:00",
      assigneeId: 0,
      notes: "",
      attendanceRequired: false,
    },
  });

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  function onSubmit(values: CreateTaskInput) {
    createTask.mutate(
      {
        name: values.name,
        dueDateTime: `${values.dueDate}T${values.dueTime}:00`,
        assigneeId: values.assigneeId,
        notes: values.notes || undefined,
        attendanceRequired: values.attendanceRequired,
      },
      {
        onSuccess: (task) => {
          toast.success(t("create.success"));
          router.push(`/tasks/${task.id}`);
        },
        onError: () => toast.error(tErrors("generic")),
      }
    );
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{t("create.title")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("fields.dueDate")}</FormLabel>
                    <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="justify-start font-normal">
                            <CalendarIcon />
                            {field.value ? format(new Date(field.value), "PP") : t("fields.pickDate")}
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
                name="dueTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.dueTime")}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.assignee")}</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("fields.pickAssignee")} />
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
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.notes")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attendanceRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">{t("fields.attendanceRequired")}</FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={createTask.isPending}>
              {t("create.submit")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

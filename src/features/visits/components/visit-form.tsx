"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api-errors";
import { useEmployeeLookup } from "@/shared/hooks/use-employee-lookup";
import { useClients } from "@features/clients/hooks/use-clients";
import { useClient } from "@features/clients/hooks/use-client";
import { useCreateVisit } from "@features/visits/hooks/use-create-visit";
import { buildCreateVisitSchema, type CreateVisitInput } from "@features/visits/schemas/create-visit.schema";

const LOCATION_MISMATCH_MARKER = "does not belong to the selected client";
const CONCURRENT_VISIT_MARKER = "already has another accepted visit";

export function VisitForm() {
  const t = useTranslations("visits");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const createVisit = useCreateVisit();
  const { data: clients } = useClients();
  const { employees } = useEmployeeLookup();

  const schema = useMemo(() => buildCreateVisitSchema(tFull), [tFull]);
  const form = useForm<CreateVisitInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: 0,
      locationId: 0,
      assigneeId: 0,
      visitDate: "",
      visitTime: "09:00",
      name: "",
      notes: "",
    },
  });

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const watchedClientId = useWatch({ control: form.control, name: "clientId" });
  const { data: selectedClient } = useClient(watchedClientId);
  const locations = selectedClient?.locations ?? [];

  function onSubmit(values: CreateVisitInput) {
    createVisit.mutate(
      {
        dateTime: `${values.visitDate}T${values.visitTime}:00`,
        clientId: values.clientId,
        locationId: values.locationId,
        assigneeId: values.assigneeId,
        name: values.name || undefined,
        notes: values.notes || undefined,
      },
      {
        onSuccess: (visit) => {
          toast.success(t("create.success"));
          router.push(`/visits/${visit.id}`);
        },
        onError: (error) => {
          const message = error instanceof ApiError ? error.message : "";
          if (message.includes(LOCATION_MISMATCH_MARKER)) {
            form.setError("locationId", { message: t("create.serverErrors.locationMismatch") });
          } else if (message.includes(CONCURRENT_VISIT_MARKER)) {
            form.setError("assigneeId", { message: t("create.serverErrors.concurrentVisit") });
          } else {
            toast.error(tErrors("generic"));
          }
        },
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
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.client")}</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(Number(v));
                      form.resetField("locationId", { defaultValue: 0 });
                    }}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("fields.pickClient")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(clients ?? []).map((client) => (
                        <SelectItem key={client.id} value={String(client.id)}>
                          {client.name}
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
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.location")}</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={field.value ? String(field.value) : undefined}
                    disabled={!watchedClientId}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("fields.pickLocation")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={String(location.id)}>
                          {location.name}
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visitDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("fields.visitDate")}</FormLabel>
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
                name="visitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.visitTime")}</FormLabel>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("fields.namePlaceholder")} {...field} />
                  </FormControl>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={createVisit.isPending}>
              {t("create.submit")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

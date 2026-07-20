"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { useCreateEmployee } from "@features/employees/hooks/use-create-employee";
import {
  buildCreateEmployeeSchema,
  type CreateEmployeeInput,
} from "@features/employees/schemas/create-employee.schema";

export default function NewEmployeePage() {
  const t = useTranslations("employees");
  const tFull = useTranslations();
  const tEnums = useTranslations("enums");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const createEmployee = useCreateEmployee();

  const schema = useMemo(() => buildCreateEmployeeSchema(tFull), [tFull]);

  const form = useForm<CreateEmployeeInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "M",
      attendanceStatus: "InOffice",
    },
  });

  function onSubmit(values: CreateEmployeeInput) {
    createEmployee.mutate(values, {
      onSuccess: (employee) => {
        toast.success(t("create.success"));
        router.push(`/employees/${employee.id}`);
      },
      onError: () => toast.error(tErrors("generic")),
    });
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{t("create.title")}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.firstName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.lastName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.email")}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.gender")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">{tEnums("gender.M")}</SelectItem>
                        <SelectItem value="F">{tEnums("gender.F")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="attendanceStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.attendanceStatus")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="InOffice">{tEnums("attendanceStatus.InOffice")}</SelectItem>
                        <SelectItem value="Absent">{tEnums("attendanceStatus.Absent")}</SelectItem>
                        <SelectItem value="OnVacation">{tEnums("attendanceStatus.OnVacation")}</SelectItem>
                        <SelectItem value="OutOfOffice">{tEnums("attendanceStatus.OutOfOffice")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={createEmployee.isPending}>
              {t("create.submit")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

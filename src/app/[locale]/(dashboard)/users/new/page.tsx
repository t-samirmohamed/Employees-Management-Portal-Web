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
import { ValidationApiError } from "@/lib/api-errors";
import { RequireRole } from "@features/auth/components/require-role";
import { useCreateUser } from "@features/users/hooks/use-create-user";
import { buildCreateUserSchema, type CreateUserInput } from "@features/users/schemas/create-user.schema";
import { CREATE_USER_ERROR_CODE_TO_FIELD } from "@features/users/lib/map-server-errors";

export default function NewUserPage() {
  const t = useTranslations("users");
  const tFull = useTranslations();
  const tEnums = useTranslations("enums");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const createUser = useCreateUser();

  const schema = useMemo(() => buildCreateUserSchema(tFull), [tFull]);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "M",
      role: "Employee",
      password: "",
    },
  });

  function onSubmit(values: CreateUserInput) {
    createUser.mutate(values, {
      onSuccess: () => {
        toast.success(t("create.success"));
        router.push("/users");
      },
      onError: (error) => {
        if (error instanceof ValidationApiError) {
          let mapped = false;
          for (const code of Object.keys(error.errors)) {
            const field = CREATE_USER_ERROR_CODE_TO_FIELD[code];
            if (field) {
              mapped = true;
              form.setError(field, { message: t(`create.serverErrors.${code}`) });
            }
          }
          if (!mapped) toast.error(t("create.serverErrors.generic"));
        } else {
          toast.error(tErrors("generic"));
        }
      },
    });
  }

  return (
    <RequireRole roles={["Admin"]}>
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.role")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">{tEnums("role.Admin")}</SelectItem>
                          <SelectItem value="Manager">{tEnums("role.Manager")}</SelectItem>
                          <SelectItem value="Supervisor">{tEnums("role.Supervisor")}</SelectItem>
                          <SelectItem value="Employee">{tEnums("role.Employee")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.password")}</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={createUser.isPending}>
                {t("create.submit")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </RequireRole>
  );
}

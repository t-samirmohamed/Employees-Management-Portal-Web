"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "@/i18n/navigation";
import { RequireRole } from "@features/auth/components/require-role";
import { useCreateClient } from "@features/clients/hooks/use-create-client";
import {
  buildCreateClientSchema,
  type CreateClientInput,
} from "@features/clients/schemas/create-client.schema";

export default function NewClientPage() {
  const t = useTranslations("clients");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const createClient = useCreateClient();

  const schema = useMemo(() => buildCreateClientSchema(tFull), [tFull]);
  const form = useForm<CreateClientInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", contact: "", locations: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "locations" });

  function onSubmit(values: CreateClientInput) {
    createClient.mutate(values, {
      onSuccess: (client) => {
        toast.success(t("create.success"));
        router.push(`/clients/${client.id}`);
      },
      onError: () => toast.error(tErrors("generic")),
    });
  }

  return (
    <RequireRole roles={["Admin", "Manager"]}>
      <Card className="max-w-2xl">
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
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.contact")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">{t("create.locations")}</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", email: "", contact: "" })}
                  >
                    {t("create.addLocation")}
                  </Button>
                </div>

                {fields.map((locationField, index) => (
                  <div key={locationField.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 rounded-md border p-3">
                    <FormField
                      control={form.control}
                      name={`locations.${index}.name`}
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
                    <FormField
                      control={form.control}
                      name={`locations.${index}.email`}
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
                    <FormField
                      control={form.control}
                      name={`locations.${index}.contact`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.contact")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-end"
                      onClick={() => remove(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={createClient.isPending}>
                {t("create.submit")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </RequireRole>
  );
}

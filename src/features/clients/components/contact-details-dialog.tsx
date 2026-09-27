"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  buildContactDetailsSchema,
  type ContactDetailsInput,
} from "@features/clients/schemas/contact-details.schema";

const EMPTY: ContactDetailsInput = { name: "", email: "", contact: "" };

// One Name/Email/Contact form dialog, used both for editing a client and for
// adding a location to one.
export function ContactDetailsDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  initialValues,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitLabel: string;
  initialValues?: ContactDetailsInput;
  isPending: boolean;
  onSubmit: (values: ContactDetailsInput) => void;
}) {
  const t = useTranslations("clients.fields");
  const tFull = useTranslations();

  const schema = useMemo(() => buildContactDetailsSchema(tFull), [tFull]);
  const form = useForm<ContactDetailsInput>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) form.reset(initialValues ?? EMPTY);
  }, [open, initialValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              if (!isPending) onSubmit(values);
            })}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
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
                  <FormLabel>{t("contact")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

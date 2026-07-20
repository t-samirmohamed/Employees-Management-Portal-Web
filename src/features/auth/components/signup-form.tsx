"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useRouter } from "@/i18n/navigation";
import { ValidationApiError } from "@/lib/api-errors";
import { useAuth } from "@features/auth/lib/auth-context";
import { useSignup } from "@features/auth/hooks/use-signup";
import { buildSignupSchema, type SignupInput } from "@features/auth/schemas/signup.schema";
import { SIGNUP_ERROR_CODE_TO_FIELD } from "@features/auth/lib/map-server-errors";
import type { SignupRequest } from "@features/auth/types/auth.types";

export function SignupForm() {
  const t = useTranslations("auth.signup");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const tEnums = useTranslations("enums");
  const router = useRouter();
  const { setSession } = useAuth();
  const signup = useSignup();

  const schema = useMemo(() => buildSignupSchema(tFull), [tFull]);

  const form = useForm<SignupInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "M",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: SignupInput) {
    const payload: SignupRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      gender: values.gender,
      password: values.password,
    };

    signup.mutate(payload, {
      onSuccess: (data) => {
        setSession({ token: data.token, expiresAtUtc: data.expiresAtUtc, email: values.email });
        router.push("/employees");
      },
      onError: (error) => {
        if (error instanceof ValidationApiError) {
          let mapped = false;
          for (const code of Object.keys(error.errors)) {
            const field = SIGNUP_ERROR_CODE_TO_FIELD[code];
            if (field) {
              mapped = true;
              form.setError(field, { message: t(`serverErrors.${code}`) });
            }
          }
          if (!mapped) toast.error(t("serverErrors.generic"));
        } else {
          toast.error(tErrors("generic"));
        }
      },
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
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
                    <FormLabel>{t("firstName")}</FormLabel>
                    <FormControl>
                      <Input autoComplete="given-name" {...field} />
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
                    <FormLabel>{t("lastName")}</FormLabel>
                    <FormControl>
                      <Input autoComplete="family-name" {...field} />
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
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("gender")}</FormLabel>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={signup.isPending}>
              {t("submit")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                {t("loginLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

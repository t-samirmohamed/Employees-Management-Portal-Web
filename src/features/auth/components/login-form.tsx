"use client";

import { useMemo, useState } from "react";
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
import { Link, useRouter } from "@/i18n/navigation";
import { UnauthorizedError } from "@/lib/api-errors";
import { useAuth } from "@features/auth/lib/auth-context";
import { useLogin } from "@features/auth/hooks/use-login";
import { buildLoginSchema, type LoginInput } from "@features/auth/schemas/login.schema";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const tFull = useTranslations();
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const { setSession } = useAuth();
  const login = useLogin();
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const schema = useMemo(() => buildLoginSchema(tFull), [tFull]);

  const form = useForm<LoginInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    setInvalidCredentials(false);
    login.mutate(values, {
      onSuccess: (data) => {
        setSession({ token: data.token, expiresAtUtc: data.expiresAtUtc, email: values.email });
        router.push("/dashboard");
      },
      onError: (error) => {
        if (error instanceof UnauthorizedError) {
          setInvalidCredentials(true);
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {invalidCredentials && (
              <p className="text-sm text-destructive">{t("invalidCredentials")}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {t("submit")}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t("noAccount")}{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                {t("signupLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

import { z } from "zod";

// Duplicated from auth/schemas/signup.schema.ts (not exported there, and this codebase
// has no cross-feature import precedent) — mirrors ASP.NET Identity's default password
// options, same as signup's own comment on that file.
const buildPasswordSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(6, t("auth.validation.passwordMinLength"))
    .regex(/[A-Z]/, t("auth.validation.passwordUppercase"))
    .regex(/[a-z]/, t("auth.validation.passwordLowercase"))
    .regex(/[0-9]/, t("auth.validation.passwordDigit"))
    .regex(/[^A-Za-z0-9]/, t("auth.validation.passwordSpecialChar"));

export const buildCreateUserSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().trim().min(1, t("validation.required")),
    lastName: z.string().trim().min(1, t("validation.required")),
    email: z.string().trim().min(1, t("validation.required")).email(t("validation.invalidEmail")),
    gender: z.enum(["M", "F"]),
    role: z.enum(["Admin", "Manager", "Supervisor", "Employee"]),
    password: buildPasswordSchema(t),
  });

export type CreateUserInput = z.infer<ReturnType<typeof buildCreateUserSchema>>;

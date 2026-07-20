import { z } from "zod";

// Mirrors ASP.NET Identity's default password options (Program.cs only overrides
// RequireUniqueEmail, so Password.* stays at the framework defaults): min length 6,
// requires upper/lower/digit/non-alphanumeric. No shared source of truth with the
// backend — if Identity's options ever change there, this drifts silently.
const buildPasswordSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(6, t("auth.validation.passwordMinLength"))
    .regex(/[A-Z]/, t("auth.validation.passwordUppercase"))
    .regex(/[a-z]/, t("auth.validation.passwordLowercase"))
    .regex(/[0-9]/, t("auth.validation.passwordDigit"))
    .regex(/[^A-Za-z0-9]/, t("auth.validation.passwordSpecialChar"));

export const buildSignupSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z.string().trim().min(1),
      lastName: z.string().trim().min(1),
      email: z.string().trim().min(1).email(),
      gender: z.enum(["M", "F"]),
      password: buildPasswordSchema(t),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      error: t("auth.signup.passwordMismatch"),
    });

export type SignupInput = z.infer<ReturnType<typeof buildSignupSchema>>;

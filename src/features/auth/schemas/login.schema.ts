import { z } from "zod";

export const buildLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().trim().min(1, t("validation.required")).email(t("validation.invalidEmail")),
    password: z.string().min(1, t("validation.required")),
  });

export type LoginInput = z.infer<ReturnType<typeof buildLoginSchema>>;

import { z } from "zod";

export const buildCreateClientSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(1, t("validation.required")),
    email: z.string().trim().min(1, t("validation.required")).email(t("validation.invalidEmail")),
    contact: z.string().trim().min(1, t("validation.required")),
    locations: z.array(
      z.object({
        name: z.string().trim().min(1, t("validation.required")),
        email: z.string().trim().min(1, t("validation.required")).email(t("validation.invalidEmail")),
        contact: z.string().trim().min(1, t("validation.required")),
      })
    ),
  });

export type CreateClientInput = z.infer<ReturnType<typeof buildCreateClientSchema>>;

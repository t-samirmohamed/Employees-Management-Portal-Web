import { z } from "zod";

// Shared by the edit-client and add-location dialogs — both edit the same
// Name/Email/Contact triple the backend's UpdateClientRequest/CreateLocationRequest carry.
export const buildContactDetailsSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(1, t("validation.required")),
    email: z.string().trim().min(1, t("validation.required")).email(t("validation.invalidEmail")),
    contact: z.string().trim().min(1, t("validation.required")),
  });

export type ContactDetailsInput = z.infer<ReturnType<typeof buildContactDetailsSchema>>;

import { z } from "zod";

export const buildCreateVisitSchema = (t: (key: string) => string) =>
  z.object({
    clientId: z.number().int().positive(t("validation.required")),
    locationId: z.number().int().positive(t("validation.required")),
    assigneeId: z.number().int().positive(t("validation.required")),
    visitDate: z.string().min(1, t("validation.required")),
    visitTime: z.string().min(1, t("validation.required")),
    name: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  });

export type CreateVisitInput = z.infer<ReturnType<typeof buildCreateVisitSchema>>;

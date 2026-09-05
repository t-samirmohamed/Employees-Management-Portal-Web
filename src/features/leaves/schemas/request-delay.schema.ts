import { z } from "zod";

export const buildRequestDelaySchema = (t: (key: string) => string) =>
  z.object({
    targetDate: z.string().min(1, t("validation.required")),
    reason: z.string().trim().min(1, t("validation.required")),
  });

export type RequestDelayInput = z.infer<ReturnType<typeof buildRequestDelaySchema>>;

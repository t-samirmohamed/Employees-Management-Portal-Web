import { z } from "zod";

export const buildCommentSchema = (t: (key: string) => string) =>
  z.object({ text: z.string().trim().min(1, t("validation.required")) });

export type CommentInput = z.infer<ReturnType<typeof buildCommentSchema>>;

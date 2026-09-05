"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddComment } from "@features/tasks/hooks/use-add-comment";
import { useUpdateComment } from "@features/tasks/hooks/use-update-comment";
import { useDeleteComment } from "@features/tasks/hooks/use-delete-comment";
import { buildCommentSchema, type CommentInput } from "@features/tasks/schemas/comment.schema";
import type { TaskComment } from "@features/tasks/types/task.types";

function CommentRow({
  comment,
  getName,
  canManage,
  taskId,
}: {
  comment: TaskComment;
  getName: (id: number) => string;
  canManage: boolean;
  taskId: number;
}) {
  const t = useTranslations("tasks.comments");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [text, setText] = useState(comment.text);
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);

  function handleSave() {
    updateComment.mutate(
      { commentId: comment.id, text },
      {
        onSuccess: () => setIsEditing(false),
        onError: () => toast.error(tErrors("generic")),
      }
    );
  }

  function handleDelete() {
    deleteComment.mutate(comment.id, {
      onSuccess: () => setConfirmDelete(false),
      onError: () => toast.error(tErrors("generic")),
    });
  }

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {getName(comment.authorEmployeeId)} · {format(new Date(comment.createdAt), "PPp")}
          {comment.updatedAt ? ` (${t("edited")})` : ""}
        </span>
        {canManage && !isEditing && (
          <div className="flex gap-2">
            <button type="button" className="hover:underline" onClick={() => setIsEditing(true)}>
              {t("edit")}
            </button>
            <button type="button" className="hover:underline" onClick={() => setConfirmDelete(true)}>
              {t("delete")}
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="mt-2 flex flex-col gap-2">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={updateComment.isPending}>
              {tCommon("save")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setText(comment.text);
                setIsEditing(false);
              }}
            >
              {tCommon("cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm whitespace-pre-wrap">{comment.text}</p>
      )}

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDeleteTitle")}</DialogTitle>
            <DialogDescription>{t("confirmDeleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleDelete} disabled={deleteComment.isPending}>
              {tCommon("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function TaskComments({
  taskId,
  comments,
  getName,
  isAdmin,
  currentEmployeeId,
}: {
  taskId: number;
  comments: TaskComment[];
  getName: (id: number) => string;
  isAdmin: boolean;
  currentEmployeeId: number | null;
}) {
  const t = useTranslations("tasks.comments");
  const tErrors = useTranslations("errors");
  const tFull = useTranslations();
  const addComment = useAddComment(taskId);

  const schema = useMemo(() => buildCommentSchema(tFull), [tFull]);
  const form = useForm<CommentInput>({
    resolver: zodResolver(schema),
    defaultValues: { text: "" },
  });

  function onSubmit(values: CommentInput) {
    addComment.mutate(values.text, {
      onSuccess: () => form.reset(),
      onError: () => toast.error(tErrors("generic")),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <div className="flex flex-col gap-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noComments")}</p>
        ) : (
          comments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              getName={getName}
              taskId={taskId}
              canManage={isAdmin || comment.authorEmployeeId === currentEmployeeId}
            />
          ))
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder={t("addPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="self-start" disabled={addComment.isPending}>
            {t("add")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

"use client";

import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskStatusBadge } from "@features/tasks/components/task-status-badge";
import type { TaskListItem } from "@features/tasks/types/task.types";

export function TaskListView({
  tasks,
  getName,
}: {
  tasks: TaskListItem[];
  getName: (id: number) => string;
}) {
  const t = useTranslations("tasks.fields");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          <TableHead>{t("dueDateTime")}</TableHead>
          <TableHead>{t("assignee")}</TableHead>
          <TableHead>{t("status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <Link href={`/tasks/${task.id}`} className="hover:underline">
                {task.name}
              </Link>
            </TableCell>
            <TableCell>{format(new Date(task.dueDateTime), "PPp")}</TableCell>
            <TableCell>{getName(task.assigneeId)}</TableCell>
            <TableCell>
              <TaskStatusBadge value={task.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

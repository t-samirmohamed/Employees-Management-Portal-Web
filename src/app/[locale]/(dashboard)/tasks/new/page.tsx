"use client";

import { RequireRole } from "@features/auth/components/require-role";
import { TaskForm } from "@features/tasks/components/task-form";

export default function NewTaskPage() {
  return (
    <RequireRole roles={["Admin", "Manager", "Supervisor"]}>
      <TaskForm />
    </RequireRole>
  );
}

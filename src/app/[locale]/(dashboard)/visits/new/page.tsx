"use client";

import { RequireRole } from "@features/auth/components/require-role";
import { VisitForm } from "@features/visits/components/visit-form";

export default function NewVisitPage() {
  return (
    <RequireRole roles={["Admin", "Manager", "Supervisor"]}>
      <VisitForm />
    </RequireRole>
  );
}

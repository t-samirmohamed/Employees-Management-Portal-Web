import { useEmployees } from "@features/employees/hooks/use-employees";
import { useAuth } from "@features/auth/lib/auth-context";

// Resolves both "display name for an employee id" (list/kanban/calendar chips,
// comment authors) and "which Employee am I" (comment-ownership gating, attendance
// display) from one shared, deduped useEmployees({}) query. Matches by email
// (session.email, set at login/signup — not decoded from the JWT) since
// GET /api/employees is available to any authenticated role, unlike the
// Admin-only GET /api/users.
export function useEmployeeLookup() {
  const { data: employees } = useEmployees({});
  const { session } = useAuth();

  const byId = new Map((employees ?? []).map((e) => [e.id, e]));
  const currentEmployee = (employees ?? []).find((e) => e.email === session?.email) ?? null;

  return {
    getName: (id: number) => {
      const e = byId.get(id);
      return e ? `${e.firstName} ${e.lastName}` : `#${id}`;
    },
    employees: employees ?? [],
    currentEmployeeId: currentEmployee?.id ?? null,
    currentEmployee,
  };
}

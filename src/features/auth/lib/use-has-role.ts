import type { Role } from "@shared/types/enums";
import { useAuth } from "@features/auth/lib/auth-context";

export function useHasRole(...roles: Role[]): boolean {
  const { role } = useAuth();
  return role !== null && roles.includes(role);
}

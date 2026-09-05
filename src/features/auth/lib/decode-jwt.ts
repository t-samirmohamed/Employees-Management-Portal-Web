import type { Role } from "@shared/types/enums";

// Verified against a real token from this backend (see .squad/plans/roles/01-story-role-gating-and-admin-user-management.md,
// Context item 6) — the role claim lives in a different legacy WIF namespace than
// nameidentifier/emailaddress, so it can't be guessed from those.
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const KNOWN_ROLES: Role[] = ["Admin", "Manager", "Supervisor", "Employee"];

export type DecodedToken = {
  userId: string;
  role: Role | null;
};

// Reads claims for UI gating only — no signature verification. The backend remains
// the sole real authorization boundary on every request.
export function decodeJwtPayload(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64)) as Record<string, unknown>;

    const rawRole = json[ROLE_CLAIM];
    const roleValue = Array.isArray(rawRole) ? rawRole[0] : rawRole;
    const role = KNOWN_ROLES.includes(roleValue as Role) ? (roleValue as Role) : null;

    return { userId: String(json.sub ?? ""), role };
  } catch {
    return null;
  }
}

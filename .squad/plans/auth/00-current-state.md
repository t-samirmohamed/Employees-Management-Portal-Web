# Auth — current state

_Snapshot of what's implemented, not a story to execute. Read this before planning new auth work._

## Implemented
- Routes: `(auth)/login`, `(auth)/signup` under `src/app/[locale]/(auth)/`.
- `src/features/auth/` — components, hooks, lib, schemas, types.
- Token + expiry stored in `localStorage` (`lib/token-storage.ts`); `getStoredSession` self-expires past `expiresAtUtc`.
- `AuthProvider` (`lib/auth-context.tsx`) hydrates from storage on mount and listens for a global `auth:session-expired` window event, dispatched by the API client on a 401.
- `AuthGuard` (`components/auth-guard.tsx`) wraps the `(dashboard)` layout and redirects unauthenticated users client-side.
- Logout is local-first/unconditional; the server revocation call is fire-and-forget (`(dashboard)/layout.tsx`).
- Zod + react-hook-form; server validation errors keyed by Identity error code, mapped to form fields (`lib/map-server-errors.ts`).

## Not implemented
- No server sessions/cookies — client-side only by design.
- No password reset / 2FA UI (backend doesn't have it either).
- No per-device session list/management UI.

## Key files
- `src/features/auth/**`, `src/app/[locale]/(auth)/**`

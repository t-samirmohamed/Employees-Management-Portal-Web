# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

Admin frontend (Next.js 16, App Router) for an Employee Management API (ASP.NET backend, separate repo). No test framework is configured in this project yet.

## Commands

```bash
npm run dev              # start dev server
npm run build            # production build
npm run start            # run production build
npm run lint             # eslint (flat config, next/core-web-vitals + next/typescript)
npm run format           # prettier --write .
npm run generate:theme   # regenerate src/shared/styles/themes.css from a Figma tokens export
```

`generate:theme` reads `--input <figma tokens json> --name <name>` (see `scripts/generate-theme.mjs`); the checked-in tokens source is `src/shared/design-tokens/figma.tokens.json`.

## Breaking Next.js version — read the docs first

This repo pins a Next.js version with breaking changes from the version in most training data (see `AGENTS.md`). Before touching routing, middleware/proxy, or data-fetching conventions, check `node_modules/next/dist/docs/`. One concrete instance already in this codebase: `middleware.ts` is deprecated and renamed to `src/proxy.ts` (still exports a `next-intl` middleware — see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`).

## Architecture

### Path aliases (tsconfig.json)

- `@/*` → `src/*` (app, components, lib, i18n, shared)
- `@features/*` → `src/features/*`
- `@shared/*` → `src/shared/*`

Note: `components.json` (shadcn) declares different aliases (`@/components`, `@/lib`, etc.) than what's actually used — shadcn CLI writes new `ui` components into `src/components/ui`, but hand-written imports elsewhere use the three aliases above.

### Feature-based structure

Code is organized by feature under `src/features/<feature>/`, each with its own `components/`, `hooks/`, `lib/`, `schemas/`, `types/`. Current features: `auth`, `employees`, `statistics`. Cross-feature/app-wide code lives in:
- `src/lib/` — API client, error types, env, react-query key factories
- `src/shared/` — providers (theme, query, zod-locale-sync), shared components (language switcher, theme toggle), design tokens/styles, shared enum types
- `src/components/ui/` — shadcn/ui primitives
- `src/components/icons/` — generated/hand-written SVG icon components (large, flat directory — check `index.ts` before adding a new one, a similar icon likely exists)

### Routing & i18n

Locale-prefixed routes under `src/app/[locale]/`, driven by `next-intl` (`src/i18n/routing.ts` defines `locales: ["en", "ar"]`, default `en`). Route groups: `(auth)` for `/login`, `/signup`; `(dashboard)` for the authenticated app (`/employees`, `/statistics`), gated by `AuthGuard`. Translation strings live in `messages/en.json` / `messages/ar.json`. Arabic renders RTL (`dir` is set from locale in `[locale]/layout.tsx`).

`[locale]/[...rest]/page.tsx` is a deliberate catch-all that calls `notFound()` from *inside* the `[locale]` tree — without it, unmatched paths skip the locale tree and fall back to the untranslated root `not-found.tsx` instead of the translated nested one.

Use `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation` (next-intl wrappers), not directly from `next/navigation`, so locale prefixes are preserved.

### Auth

Client-side only, no server sessions/cookies:
- Token + expiry stored in `localStorage` (`src/features/auth/lib/token-storage.ts`); `getStoredSession` self-expires past `expiresAtUtc`.
- `AuthProvider` (`src/features/auth/lib/auth-context.tsx`) hydrates from storage on mount and listens for a global `auth:session-expired` window event (dispatched by the API client on a 401 from an authenticated call) to force logout + redirect to `/login`.
- `AuthGuard` (`src/features/auth/components/auth-guard.tsx`) wraps the `(dashboard)` layout and redirects unauthenticated users client-side.
- Logout is local-first and unconditional; the server revocation call is fire-and-forget and never blocks signing out (`(dashboard)/layout.tsx`).

### Data fetching

`src/lib/api-client.ts` wraps `fetch` against `NEXT_PUBLIC_API_BASE_URL` (`src/lib/env.ts`, defaults to `http://localhost:5134`), auto-attaching the stored bearer token unless `{ auth: false }` is passed (used for the login/signup calls themselves, since those 401 on bad credentials without meaning the session died). It normalizes 401/404/400-with-`errors` into typed errors from `src/lib/api-errors.ts` (`UnauthorizedError`, `NotFoundError`, `ValidationApiError`).

All server state goes through TanStack Query. Query keys are centralized in `src/lib/query-keys.ts` (`employeeKeys`, `statisticsKeys`) — extend these factories rather than inlining key arrays in hooks. Each feature's `hooks/` contains one `useQuery`/`useMutation` hook per endpoint.

Form validation uses `zod` + `react-hook-form` via `@hookform/resolvers`; schemas live in each feature's `schemas/` dir. `ZodLocaleSync` (`src/shared/lib/zod-locale-sync.tsx`) switches zod's built-in error messages between `en`/`ar` based on the active next-intl locale.

Domain enums (`src/shared/types/enums.ts`) intentionally mirror the exact wire values of the backend's C# enums (`Gender`, `EmployeeStatus`, `AttendanceStatus`) — these are the literal JSON strings, not display labels, so don't "clean up" the casing.

Server validation errors on signup are keyed by ASP.NET Identity error *code* (e.g. `PasswordTooShort`), not field name — `src/features/auth/lib/map-server-errors.ts` maps codes to form fields.

### Theming

Tailwind v4 CSS-variable theme in `src/app/globals.css` (`@theme inline`) sourced from `src/shared/styles/*.css`, generated by `scripts/generate-theme.mjs` from Figma tokens — edit the tokens/script, don't hand-edit `themes.css` generated values directly. Dark mode via `next-themes` (`src/shared/lib/theme-provider.tsx`).

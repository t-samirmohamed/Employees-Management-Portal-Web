# Story 03 — Clients & Locations Management

## Prerequisites

- Story 01 (`roles`) — role-gating primitives.
- Backend companion story shipped: `EmpoloyeeManagment/Endpoints/ClientEndpoints.cs` + `Dtos/Clients/ClientDtos.cs` — full contract already extracted during initial research (see Context item 2).

## Story Goal

1. `/clients` list — Admin/Manager see all clients; Supervisor sees only their own assigned client (both enforced server-side; the frontend just renders whatever the API returns — no client-side role-filtering logic to write). Employee cannot reach this route at all (backend's whole `/api/clients` group requires `TaskAssigner`: Admin/Manager/Supervisor only).
2. `/clients/{id}` detail — Name/Email/Contact, its Locations (Name/Email/Contact each), and a visit-count stat for a selectable range (month/3month/6month/year).
3. `/clients/new` — create a client with N locations in one form (Admin/Manager only, `ClientManager` policy). **Not in the intake's literal acceptance criteria, added anyway**: the intake only asked for list/detail, but the backend ships `POST /api/clients` and leaving it completely unreachable from the UI would contradict this whole initiative's goal of catching the frontend up to what's shipped — mirrors the same judgment call Story 01 made for `POST /api/users`.

**Out of scope** (per intake): visit calendar/kanban views (belongs to `visits`/`tasks`), cross-client "most visited" ranking (belongs to `dashboards`), editing/deleting a client or location (backend has no such endpoints — `CLAUDE.md` v1 gap).

## Context — Read These Files First

1. **Backend contract** (`EmpoloyeeManagment/Endpoints/ClientEndpoints.cs`, `Dtos/Clients/ClientDtos.cs`, extracted in full during initial research): group requires `TaskAssigner`; `POST` additionally requires `ClientManager` (Admin/Manager). `GET /api/clients` row-scopes Supervisor to their own client (via `Employee.AssignedLocationId` → `Location.ClientId`); `GET /api/clients/{id}` 404s for a Supervisor viewing a client that isn't theirs. `GET /api/clients/{id}/visit-stats?range=month|3month|6month|year` (required string param, else 400) → `ClientVisitStatsDto(ClientId, Range, VisitCount)`. `CreateClientRequest(Name, Email, Contact, Locations: CreateLocationRequest[]?)`, `CreateLocationRequest(Name, Email, Contact)`. `ClientListItemDto(Id, Name, Email, Contact)` (no locations); `ClientDetailDto` adds `CreatedAt, Locations: LocationDto[]`.
2. `src/app/[locale]/(dashboard)/statistics/page.tsx` — the `Card`+`CardHeader`+big-number stat-tile pattern this story's visit-stats tile reuses verbatim (intake's own hint: "reuse whatever pattern the existing statistics feature already uses").
3. `src/features/employees/` — file-per-concern convention this story's `src/features/clients/` mirrors.
4. `src/features/auth/components/require-role.tsx` — used for both `/clients` (`["Admin","Manager","Supervisor"]`) and `/clients/new` (`["Admin","Manager"]`).
5. `react-hook-form`'s `useFieldArray` (already installed, not yet used anywhere in this codebase) — needed for the create form's dynamic Locations list. First use of this pattern here; a plain array of `{name, email, contact}` rows with add/remove buttons.

## Frontend Tasks

`No backend changes required.`

### 1 — `clientKeys`

**File: `src/lib/query-keys.ts`** — append:
```ts
export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  details: () => [...clientKeys.all, "detail"] as const,
  detail: (id: number) => [...clientKeys.details(), id] as const,
  visitStats: (id: number, range: string) => [...clientKeys.detail(id), "visit-stats", range] as const,
};
```

### 2 — Types

**Create file: `src/features/clients/types/client.types.ts`** — `Location{id,name,email,contact}`, `ClientListItem{id,name,email,contact}`, `ClientDetail = ClientListItem & {createdAt, locations: Location[]}`, `ClientVisitStats{clientId,range,visitCount}`, `CreateLocationRequest{name,email,contact}`, `CreateClientRequest{name,email,contact,locations?: CreateLocationRequest[]}`.

### 3 — Schema

**Create file: `src/features/clients/schemas/create-client.schema.ts`** — `buildCreateClientSchema(t)`: `name/email/contact` required strings for the client, plus `locations: z.array(z.object({name,email,contact: required strings}))` (default `[]`, no min-length requirement — `Locations` is optional server-side).

### 4 — Hooks

- `hooks/use-clients.ts` — `GET /api/clients`.
- `hooks/use-client.ts` — `GET /api/clients/{id}`.
- `hooks/use-client-visit-stats.ts(id, range)` — `GET /api/clients/{id}/visit-stats?range=...`, `queryKey: clientKeys.visitStats(id, range)`.
- `hooks/use-create-client.ts` — `POST /api/clients`, invalidates `clientKeys.lists()`.

### 5 — Components

**Create file: `src/features/clients/components/client-visit-stats.tsx`** — 4-button range selector (`month|3month|6month|year`, local `useState`, default `"month"`) + one `Card` stat tile (mirrors `statistics/page.tsx`'s plain-number tile) showing `visitCount`.

**Create file: `src/features/clients/components/location-list.tsx`** — plain `Table` (Name/Email/Contact columns), or a `Card`-per-location list if a client has very few locations typically — use `Table` for consistency with every other list in this codebase.

### 6 — Pages

- `src/app/[locale]/(dashboard)/clients/page.tsx` — `RequireRole(["Admin","Manager","Supervisor"])` wraps a plain `Table` (Name/Email/Contact, row links to detail) + `Add client` button visible only via `useHasRole("Admin","Manager")`.
- `src/app/[locale]/(dashboard)/clients/new/page.tsx` — `RequireRole(["Admin","Manager"])`; form with Name/Email/Contact + a `useFieldArray`-driven Locations list (each row: Name/Email/Contact + remove button; an "Add location" button appends an empty row).
- `src/app/[locale]/(dashboard)/clients/[id]/page.tsx` — `RequireRole(["Admin","Manager","Supervisor"])`; Name/Email/Contact, `LocationList`, `ClientVisitStats`.

### 7 — Nav + translations

**File: `(dashboard)/layout.tsx`** — add `Clients` link gated by `useHasRole("Admin","Manager","Supervisor")` (Employee never sees it, matching the backend's group-level policy exactly).

**Files: `messages/en.json`/`ar.json`** — `nav.clients`, and a `clients` namespace (`list`, `fields`, `create`, `detail`, `visitStats` with range-button labels) mirroring `employees`'/`tasks`' shape.

## Edge Cases

- Supervisor with no `AssignedLocationId` — backend returns an empty clients list; frontend just shows the existing empty-state message, no special-case needed.
- `range` must be one of the 4 exact literal strings — the range selector only ever sends one of those 4 values, so the 400 path is unreachable from the UI (still exists as a defensive fact, not something to handle specially).
- Creating a client with zero locations — allowed (`Locations` optional server-side); the form's `useFieldArray` starts with an empty array, not one blank row, so submitting immediately with no locations added is valid.

## Test Plan

1. As Admin/Manager: `/clients` shows all clients; create one with 2 locations; confirm it appears in the list and its detail page shows both locations.
2. As Supervisor (with an `AssignedLocationId` set — e.g. via direct DB update, since no frontend flow sets this yet per Story 01's deferred picker): confirm `/clients` shows only their own client.
3. As Employee: confirm no `Clients` nav link and direct navigation to `/clients` redirects away.
4. Visit-stats: switch between the 4 range buttons on a client detail page; confirm the count updates (won't be meaningful without real Visit data yet — Visits ships in Story 04 — but the mechanism itself should work, likely showing 0 for every range today).
5. Regression: Stories 01/02 and pre-existing flows still work.

## Verification Steps

1. `npm run build` && `npm run lint`.
2. Manual browser walkthrough of the Test Plan above.

## Done Criteria

- [ ] `clientKeys` added; `src/features/clients/` implemented (types/schemas/hooks/components).
- [ ] `/clients`, `/clients/new`, `/clients/{id}` implemented with the role gating above.
- [ ] Nav shows `Clients` for Admin/Manager/Supervisor only.
- [ ] `en.json`/`ar.json` updated and mirrored.
- [ ] Manual Test Plan passes.

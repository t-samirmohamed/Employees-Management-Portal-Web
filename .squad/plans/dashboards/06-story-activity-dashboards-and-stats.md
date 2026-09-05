# Story 06 — Activity Dashboards & Stats

## Prerequisites

- Story 01 (`roles`). Backend contract (`EmpoloyeeManagment/Endpoints/StatisticsEndpoints.cs`, `Dtos/Statistics/StatisticsDtos.cs`) already extracted during initial research (Context item 1).
- **Extends** the existing `src/features/statistics/` feature (currently just `GET /api/statistics/employees`, consumed by `/statistics`) rather than duplicating it — per the intake's explicit instruction.
- Depends on `clients` (Story 03) only for the "most visited clients" widget's data shape familiarity (no code import needed — it's a fresh endpoint call, not a reuse of Story 03's per-client stat component, since that one is scoped to one client + a different DTO shape).

## Story Goal

Four additions, all consuming already-shipped, already-researched backend endpoints:

1. **Employee monthly activity** — embedded into the *existing* `/employees/{id}` detail page (not a new route, per intake: "in their details view"). Month/year picker (default: current month), showing `TotalTasks`/`TasksByStatus`/`TotalVisits`/`VisitsByStatus`/`CurrentAttendanceStatus`/`AttendanceDrivingTaskCount`. **Leaves column is not shown — the backend DTO has no Leaves field at all** (confirmed: `EmployeeMonthlyActivityDto` has no leave-related property; `EmpoloyeeManagment/CLAUDE.md` documents this as an explicitly deferred backend follow-up, not something this frontend story can add without a new backend field). Visible to `TaskAssigner` (Admin/Manager/Supervisor) only — a plain Employee can still view `/employees/{id}` pages at all (no row-scoping on that route), just never sees this section.
2. **Status/visit stats** widget on `/statistics` — `TasksByStatus`/`VisitsByStatus`, all-time, auto-scoped server-side (Admin/Manager see all; Supervisor sees only their team — same call, no client-side branching needed). This doubles as "Supervisor's own status/visits widget on their landing dashboard" (Story Goal's 5th bullet) — it's the exact same widget, the backend already narrows it correctly, no separate view needed.
3. **Most visited clients** widget on `/statistics` — ranked list + the same 4-button range selector pattern as Story 03's per-client visit-stats (`ClientVisitStats`) — Admin/Manager only (`ClientManager`).
4. **Supervisor/team rollup** widget on `/statistics` — one row per Supervisor (name, assigned client, team size, open task count, attendance breakdown) — Admin/Manager only (`ClientManager`).

**Refactor while extending**: `statistics/page.tsx`'s inline `BreakdownCard` (currently private to that file, typed to only 3 enum namespaces) is promoted to `src/features/statistics/components/breakdown-card.tsx` and its `labelNamespace` union extended with `"taskItemStatus"`, since the new Status/visit-stats widget is the second real consumer of the identical dictionary-of-counts-with-a-title pattern.

## Context — Read These Files First

1. **Backend contract** (`EmpoloyeeManagment/Endpoints/StatisticsEndpoints.cs`, `Dtos/Statistics/StatisticsDtos.cs`, extracted in full during initial research):
   - `GET /api/statistics/employees/{id}/monthly` (`TaskAssigner`; Supervisor 404s outside their team) — query `year:int`, `month:int` (1-12, else 400). Response `EmployeeMonthlyActivityDto(EmployeeId, Year, Month, TotalTasks, TasksByStatus, TotalVisits, VisitsByStatus, CurrentAttendanceStatus, AttendanceDrivingTaskCount)`.
   - `GET /api/statistics/status` (`TaskAssigner`) — no params. `StatusStatsDto(TasksByStatus, VisitsByStatus)`.
   - `GET /api/statistics/clients/most-visited` (`ClientManager`) — query `range` (required: `month|3month|6month|year`, else 400), `top` (optional int, default 10, clamped 1-100). `MostVisitedClientDto[] {ClientId, ClientName, VisitCount}`, ordered desc.
   - `GET /api/statistics/supervisors` (`ClientManager`) — no params. `SupervisorTeamStatsDto[] {SupervisorEmployeeId, SupervisorName, AssignedClientId, AssignedClientName, TeamEmployeeIds: int[], OpenTaskCount, TeamAttendanceStatusBreakdown}`.
   - All dictionary-valued fields (`TasksByStatus`, `VisitsByStatus`, `TeamAttendanceStatusBreakdown`) key by the enum's exact member name and **omit zero-count keys** — already handled by the existing `BreakdownCard`'s `Object.entries` + empty-state pattern; nothing new needed for that.
2. `src/app/[locale]/(dashboard)/statistics/page.tsx` (whole file) — the `BreakdownCard` component being promoted (task 1) and the page's existing layout grid this story adds three more sections to.
3. `src/features/statistics/hooks/use-employee-statistics.ts`, `types/statistics.types.ts` — the one-hook-per-endpoint / flat-key (`statisticsKeys.employees`) convention this story extends with 4 more keys and 4 more hooks.
4. `src/app/[locale]/(dashboard)/employees/[id]/page.tsx` — not yet read in this session; read it before task 6 to confirm its current structure (props, data shape, existing sections) so the new monthly-activity block is inserted consistently rather than guessed at.
5. `src/features/clients/components/client-visit-stats.tsx` (Story 03) — the exact 4-button range-selector pattern task 5 (most-visited clients) reuses (`month|3month|6month|year`, local `useState`, default `"month"`).
6. `src/shared/hooks/use-employee-lookup.ts` — `getName(id)` resolves `TeamEmployeeIds` in the supervisor rollup widget to display names instead of bare ids.

## Frontend Tasks

`No backend changes required.`

### 1 — Promote `BreakdownCard`

**Create file: `src/features/statistics/components/breakdown-card.tsx`** — moved verbatim from `statistics/page.tsx`, with `EnumNamespace` extended:
```ts
export type EnumNamespace = "gender" | "status" | "attendanceStatus" | "taskItemStatus";
```
**File: `src/app/[locale]/(dashboard)/statistics/page.tsx`** — remove the inline definition, import from the new location.

### 2 — Extend statistics types and query keys

**File: `src/features/statistics/types/statistics.types.ts`** — append `EmployeeMonthlyActivity`, `StatusStats`, `MostVisitedClient`, `SupervisorTeamStats` (field names as in Context item 1, camelCased).

**File: `src/lib/query-keys.ts`** — extend `statisticsKeys`:
```ts
export const statisticsKeys = {
  employees: ["statistics", "employees"] as const,
  employeeMonthly: (id: number, year: number, month: number) =>
    ["statistics", "employees", id, "monthly", year, month] as const,
  status: ["statistics", "status"] as const,
  mostVisitedClients: (range: string) => ["statistics", "clients", "most-visited", range] as const,
  supervisors: ["statistics", "supervisors"] as const,
};
```

### 3 — Hooks

- `hooks/use-employee-monthly-activity.ts(id, year, month)` — `GET /api/statistics/employees/{id}/monthly?year=&month=`; `enabled: Number.isFinite(id)`.
- `hooks/use-status-stats.ts` — `GET /api/statistics/status`.
- `hooks/use-most-visited-clients.ts(range, top?)` — `GET /api/statistics/clients/most-visited?range=&top=`.
- `hooks/use-supervisor-team-stats.ts` — `GET /api/statistics/supervisors`.

### 4 — Status/visit stats widget

**Amended after initial implementation** (user request, live in-session): rendered as **donut pie charts**, not `BreakdownCard` lists — `src/features/statistics/components/status-pie-chart.tsx` (conic-gradient donut + always-visible legend with color swatch/label/value/%, so the legend doubles as the dataviz skill's required "relief channel" for the contrast WARN below). Colors: this app's own `--chart-1..5` design tokens (`src/shared/styles/themes.css`), validated via the dataviz skill's `validate_palette.js` in the fixed order `New(chart-1)/InProgress(chart-2)/Rejected(chart-3)/Cancelled(chart-4)/Done(chart-5)` — all 6 checks pass in both light and dark, except a contrast WARN on 2 slots (mitigated by the always-on legend). One adjustment: light-mode `chart-1` (`#F5BD02`, Figma-exported, never previously consumed anywhere in this codebase) failed the OKLCH lightness band, so the component uses the same value the theme already assigns to `chart-1` in **dark** mode (`#DBA102`) for both modes — `themes.css` itself is generated from Figma tokens and isn't hand-edited (per `CLAUDE.md`); the override lives only in the new component, documented inline there.

**Create file: `src/features/statistics/components/status-stats-card.tsx`** — two `StatusPieChart`s side by side (`TasksByStatus`/`VisitsByStatus`), fed by `useStatusStats()`.

**Further amended** (user request, live in-session): each slice is a real SVG `<path>` (donut arc, not a CSS conic-gradient div) with `onMouseEnter`/`onMouseMove`/`onFocus`/`onBlur` — hovering or focusing a slice dims its siblings (opacity 0.6) and shows a floating tooltip (`<value>` bold, `<label> (<percent>%)` secondary — "values lead, labels follow" per the dataviz skill) positioned at the cursor; keyboard focus shows the same tooltip centered on the slice, so the detail is reachable without a mouse. A single-slice (100%) case is handled separately (two concentric `<circle>`s) since the arc-path math degenperates at a full circle. Verified interactively: hovering a slice renders e.g. "4 Done (27%)" and visibly dims the other four.

### 5 — Most visited clients widget

**Create file: `src/features/statistics/components/most-visited-clients-card.tsx`** — `Card` with the 4-button range selector (mirrors `ClientVisitStats`) + a simple ranked list/table (`ClientName` — `Link href="/clients/{id}"` — and `VisitCount`), fed by `useMostVisitedClients(range)`.

### 6 — Supervisor team rollup widget

**Create file: `src/features/statistics/components/supervisor-team-stats-table.tsx`** — `Table`: Supervisor name, assigned client (name or "—" if `assignedClientId` is null), team size (`teamEmployeeIds.length`), open task count, attendance breakdown (compact inline text, e.g. `InOffice: 3, OutOfOffice: 1`, not a full second `BreakdownCard` per row — a table cell isn't the right shape for that).

### 7 — Wire into `/statistics` page

**File: `src/app/[locale]/(dashboard)/statistics/page.tsx`** — after the existing 4-tile grid, add (each gated, each with its own loading/empty handling matching the page's existing `isLoading` pattern):
```tsx
{useHasRole("Admin", "Manager", "Supervisor") && <StatusStatsCard />}
{useHasRole("Admin", "Manager") && <MostVisitedClientsCard />}
{useHasRole("Admin", "Manager") && <SupervisorTeamStatsTable />}
```

### 8 — Wire into employee detail page

**File: `src/app/[locale]/(dashboard)/employees/[id]/page.tsx`** — add an `EmployeeMonthlyActivity` section (new component, `src/features/statistics/components/employee-monthly-activity.tsx`: month/year `Select`s defaulting to the current month — `new Date()` is fine here, this is application runtime code, not a workflow script — feeding `useEmployeeMonthlyActivity(id, year, month)`, rendered via two more `BreakdownCard`s + the three scalar fields (`TotalTasks`, `TotalVisits`, `CurrentAttendanceStatus` via the existing `AttendanceBadge`, `AttendanceDrivingTaskCount`)), gated by `useHasRole("Admin", "Manager", "Supervisor")`. On a 404 (Supervisor viewing someone outside their team) show a plain "not available" message, not an error toast — this is an expected, not exceptional, outcome of the backend's team scoping.

### 9 — Translations

Extend the existing `statistics` namespace (`en.json`/`ar.json`) with keys for all four new widgets and the monthly-activity section; no new top-level namespace needed.

## Edge Cases

- **Supervisor with no team** — `status`/`supervisors`-shaped calls already return empty dicts/lists server-side; existing empty-state copy covers it, no special-casing needed.
- **Employee monthly activity 404** (Supervisor, out-of-team employee) — handled explicitly (task 8) as a quiet "not available" state, not a generic error toast — this is routine, expected backend behavior, not a failure.
- **`month` out of 1–12** — unreachable from the UI; the month `Select` only ever offers 1–12.
- **Zero-count dictionary keys omitted by the backend** — already handled by the existing `BreakdownCard` (`Object.entries` over whatever keys are present; nothing assumes all keys exist).

## Test Plan

1. As Admin, open an employee's detail page; confirm the monthly activity section shows for the current month, and that switching month/year re-fetches correctly.
2. As a Supervisor, open an employee **outside** their team's detail page; confirm a graceful "not available" message, not a crash or a raw error toast.
3. On `/statistics` as Admin/Manager: confirm Status/visit stats, Most visited clients (with working range buttons), and Supervisor team rollup all render.
4. On `/statistics` as Supervisor: confirm only the Status/visit stats widget appears (team-scoped), and Most-visited-clients / Supervisor-rollup do not.
5. On `/statistics` as Employee: confirm none of the three new widgets appear, only the original 4-tile employee breakdown.
6. Regression: Stories 01–05 and the original `/statistics` page content.

## Verification Steps

1. `npm run build` && `npm run lint`.
2. Manual browser walkthrough of the Test Plan.

## Done Criteria

- [ ] `BreakdownCard` promoted to `src/features/statistics/components/`, `taskItemStatus` namespace added.
- [ ] 4 new hooks + extended `statisticsKeys` + extended types.
- [ ] 3 new `/statistics` widgets, each correctly role-gated.
- [ ] Employee monthly activity embedded in `/employees/{id}`, role-gated, 404 handled gracefully.
- [ ] `en.json`/`ar.json` extended.
- [ ] Manual Test Plan passes.

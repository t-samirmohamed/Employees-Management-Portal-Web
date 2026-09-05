# visits — plan overview

Entry point for the **visits** feature. Stories execute in order by their `NN` prefix.

## Stories

| NN | File | Title | Tracker id | Depends on |
|----|------|-------|------------|------------|
| 04 | [04-story-visit-tracking-status.md](04-story-visit-tracking-status.md) | Visit Tracking & Status | none | `roles` (01), `tasks` (02), `clients` (03) |

## Dependency notes

Promotes `useEmployeeLookup` from `tasks` to `src/shared/hooks/` (second real consumer). Reuses `tasks`' `KanbanBoard`/`CalendarMonthView` (kanban made read-only via a new prop) and `clients`' client/location data.

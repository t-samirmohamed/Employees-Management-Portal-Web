# dashboards — plan overview

Entry point for the **dashboards** feature. Stories execute in order by their `NN` prefix.

## Stories

| NN | File | Title | Tracker id | Depends on |
|----|------|-------|------------|------------|
| 06 | [06-story-activity-dashboards-and-stats.md](06-story-activity-dashboards-and-stats.md) | Activity Dashboards & Stats | none | `roles` (01); extends the existing `statistics` feature |

## Dependency notes

Consumes already-shipped backend endpoints only — no dependency on the `tasks`/`visits`/`clients`/`leaves` frontend stories' code, just their domain data existing server-side for the widgets to show something non-empty.

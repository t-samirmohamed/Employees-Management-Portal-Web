# notifications — plan overview

Entry point for the **notifications** feature. Stories execute in order by their `NN` prefix.

## Stories

| NN | File | Title | Tracker id | Depends on |
|----|------|-------|------------|------------|
| 07 | [07-story-leave-request-notifications.md](07-story-leave-request-notifications.md) | Leave Request Notifications | none | `roles` (01), `leaves` (05) |

## Dependency notes

Last story in the initial 7-story roadmap. Originally shipped with a known accepted limitation (backend trigger unwired, UI would show nothing in practice) — since resolved via an explicitly user-approved backend extension (real triggers for leave submit/accept/reject/delay plus new task/visit assignment notifications). See the story file's "Addendum" section.

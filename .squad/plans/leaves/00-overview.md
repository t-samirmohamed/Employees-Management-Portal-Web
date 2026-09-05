# leaves — plan overview

Entry point for the **leaves** feature. Stories execute in order by their `NN` prefix.

## Stories

| NN | File | Title | Tracker id | Depends on |
|----|------|-------|------------|------------|
| 07 | [07-story-leave-requests-approval-workflow.md](07-story-leave-requests-approval-workflow.md) | Leave Requests & Approval Workflow | none | `roles` (Story 01) |

## Dependency notes

Functionally independent of `tasks`/`clients`/`visits`. Feeds `notifications` (Story after `dashboards`), which deep-links into this feature's approver queue.

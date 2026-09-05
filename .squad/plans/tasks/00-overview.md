# tasks — plan overview

Entry point for the **tasks** feature. Stories execute in order by their `NN` prefix.

## Stories

| NN | File | Title | Tracker id | Depends on |
|----|------|-------|------------|------------|
| 02 | [02-story-task-management-assignment-workflow.md](02-story-task-management-assignment-workflow.md) | Task Management & Assignment Workflow | none | `roles` (Story 01) |

## Dependency notes

Builds the shared `src/shared/components/view-modes/` calendar/kanban/list substrate that `visits` (Story 04) will reuse — do not duplicate it when planning that story. Attachments and the related-visit picker are deferred (no backend API for the former yet; `visits` doesn't exist yet for the latter).

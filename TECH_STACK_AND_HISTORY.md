# Employee Management System — Tech Stack & Project History

A simple overview of what this project is built with and how it got to its current state. For deep technical detail, see each repo's own `CLAUDE.md`/`README.md` — this is the short version.

## What this project is

A full-stack employee management system split across **two separate repositories**, joined only by an HTTP API contract:

- **Backend** — `EmpoloyeeManagment` (`https://github.com/t-samirmohamed/Employees-Management-Portal`) — a .NET API and database.
- **Frontend** — `employee-management-web` (`https://github.com/t-samirmohamed/Employees-Management-Portal-Web`, this repo) — a Next.js web app that consumes that API.

It manages employees, roles/permissions, task assignment, client visits, leave requests, activity dashboards, and notifications.

## Technology stack

### Backend

| Piece | Choice |
|---|---|
| Runtime | .NET 10, ASP.NET Core **minimal APIs** (no MVC controllers) |
| Database | SQL Server via **EF Core 10** |
| Auth | ASP.NET Core **Identity Core** + **JWT bearer tokens**, with real server-side logout (rotating a security stamp invalidates old tokens) |
| Authorization | 4 fixed roles (Admin / Manager / Supervisor / Employee) via named policies, plus hand-written row-level checks (e.g. an Employee only sees their own tasks) |
| API docs | Swagger UI on top of the native .NET OpenAPI generator |
| Logging | Custom middleware logs every API call to its own database table |

Key packages: `Microsoft.AspNetCore.Authentication.JwtBearer`, `Microsoft.AspNetCore.Identity.EntityFrameworkCore`, `Microsoft.EntityFrameworkCore.SqlServer`, `Microsoft.AspNetCore.OpenApi`, `Swashbuckle.AspNetCore.SwaggerUI`.

### Frontend

| Piece | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack dev server) on **React 19** |
| Language | TypeScript |
| Styling / UI kit | **Tailwind CSS v4** + **shadcn/ui** (built on Radix primitives) |
| Data fetching | **TanStack Query v5** for all server state |
| Forms | **react-hook-form** + **zod** validation |
| i18n | **next-intl** — English + Arabic, including right-to-left layout |
| Drag & drop | **dnd-kit** (task/visit kanban boards) |
| Dates | **date-fns** + **react-day-picker** |
| Icons | lucide-react |

### Shared tooling

- **squad-kit** — a planning CLI (`.squad/` folders in both repos) that turns a feature "intake" doc into a numbered implementation plan before each feature gets built.
- **Git** — two independent repositories; no monorepo tooling links them.

## How the pieces fit together

- The **backend is the single source of truth** for data, business rules, and authorization — it decides what's allowed (e.g. who can approve a leave request); the frontend calls it and renders the result.
- The **frontend has no separate copy of business logic** — roles, statuses, and permissions all come from the user's JWT and live API responses (e.g. a "Submit" button hides itself based on the role read out of the user's own token).
- Feature areas mirror each other by name across both repos: Auth, Employees, Users, Tasks, Clients, Visits, Leaves, Statistics/Dashboards, Notifications.

## Steps taken to get here

**1. Backend foundation.** Initial ASP.NET Core project scaffolded: employee records and the employee ↔ user account relationship.

**2. Frontend foundation.** Next.js app scaffolded, with authentication (login/signup/auth guard) and shared form components built first.

**3. Backend: core features.** A large push added, roughly in order: CORS configuration, the squad-kit planning setup, then feature by feature — role-based access control and admin user management, task assignment with comments, clients & locations, visit tracking, activity dashboards/statistics, and leave requests plus a first version of notifications (storage and reading only, nothing creating one yet).

**4. Frontend: catching up to the backend.** At this point the frontend only covered Auth, Employees, and basic Statistics — seven backend feature areas had no UI yet. Using the C# backend as a fixed API reference, the frontend was brought up to parity one feature at a time, in dependency order:
**Roles → Tasks → Clients → Visits → Leaves → Dashboards → Notifications** — each one planned with squad-kit, then implemented and checked in a real browser before moving to the next. Along the way, the statistics dashboard's status/visit breakdown became accessible SVG donut charts with hover tooltips.

**5. Backend: real notification triggers.** The notifications feature originally only *stored* and *read* notifications — nothing ever created one. It was extended to add `TaskAssigned`, `VisitAssigned`, `LeaveRequestAccepted`, `LeaveRequestRejected`, and `LeaveRequestDelayRequested` alongside the original `LeaveRequestSubmitted`, to actually call the notification service from the leave/task/visit endpoints, and to update the frontend so it understands and deep-links all six notification types — including fixing a bug where Employees couldn't see their own notification bell.

## Where things live

- Backend code: `https://github.com/t-samirmohamed/Employees-Management-Portal` — see its own `CLAUDE.md` / `README.md` for full architecture detail.
- Frontend code: `https://github.com/t-samirmohamed/Employees-Management-Portal-Web` (this repo) — see its own `CLAUDE.md` / `README.md`, plus `.squad/plans/` for the per-feature implementation plans referenced above.

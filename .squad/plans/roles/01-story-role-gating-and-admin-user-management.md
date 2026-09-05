# Story 01 — Role Gating & Admin User Management

## Prerequisites

- None. This is the first frontend story planned in this workspace (`squad status` confirmed 0 plan files before this one). It is a hard prerequisite for all 6 sibling stories (`tasks`, `clients`, `visits`, `leaves`, `dashboards`, `notifications`), which all consume the role-gating primitives this story introduces.
- Backend companion story already shipped: `EmpoloyeeManagment` repo, `.squad/plans/roles/01-story-role-model-and-admin-user-management.md` — `GET`/`POST /api/users`, the `Role` enum, `AdminOnly`/`TaskAssigner`/`ClientManager`/`LeaveRequester` policies, and `AdminAuthorizationHandler` (Admin bypasses every named policy) are all live and verified against a running instance of the backend (see Context item 6).

## Story Goal

Give the frontend a concept of "the current user's role" (today it has none — see Context item 1) and one Admin-only screen that uses it, so every later story can gate its own UI the same way:

1. Decode the caller's role and user id from the already-issued JWT (no backend change, no new endpoint) and expose them from the existing `useAuth()` hook.
2. Two reusable gating primitives — `useHasRole(...roles)` for inline conditionals, `<RequireRole roles={[...]}>` for whole-route/whole-section gating — built as a one-level extension of the existing `AuthGuard` pattern, not a new convention.
3. A new Admin-only "Users" screen: list every system user (email, role, linked employee if any) and create a new user with an assigned role.
4. Retrofit: hide the employee list's Activate/Deactivate actions from non-Admins (the backend already 403s these for non-Admins; the frontend has never known to hide them).

**Not in scope**: `AssignedLocationId` on the create-user form (Locations don't exist on the frontend until Story 03/`clients` ships — the field is nullable server-side, so omitting it just means new Supervisors aren't location-scoped until a small follow-up once `clients` lands). No UI for any other feature (tasks/clients/visits/leaves/dashboards/notifications) — separate stories.

---

## Context — Read These Files First

1. `src/features/auth/types/auth.types.ts`, `src/features/auth/lib/token-storage.ts` (whole file, 39 lines), `src/features/auth/lib/auth-context.tsx` (whole file, 69 lines) — confirms today's session is exactly `{token, expiresAtUtc, email}`. No role, no user id, anywhere. `useAuth()` returns `{session, isAuthenticated, isInitializing, setSession, logout}` — this story adds `role`/`userId` fields here, nothing else changes shape.
2. `src/features/auth/components/login-form.tsx` and `signup-form.tsx` — both call `setSession({ token: data.token, expiresAtUtc: data.expiresAtUtc, email: values.email })` (signup-form.tsx line 62). **Do not touch these call sites** — `StoredSession` stays exactly as-is; role/userId are derived from the token in `auth-context.tsx`, not persisted redundantly.
3. `src/features/auth/components/auth-guard.tsx` (whole file, 29 lines) — the `useEffect` + `router.replace("/login")` + `isInitializing` skeleton shape that `RequireRole` (task 4) copies one level.
4. `src/shared/types/enums.ts` (6 lines) — the exact one-line-per-enum style (`export type X = "A" | "B";`) that the new `Role` type (task 2) must match.
5. `src/lib/query-keys.ts` (13 lines) — `employeeKeys`/`statisticsKeys` both live in this one shared file; `userKeys` (task 6) goes here too, not a new file.
6. **Verified against a live backend** (not just read — actually called): signed up + logged in a throwaway user against the running API (`http://localhost:5134`), decoded the real returned JWT. Confirmed claim keys:
   - `sub` → user id (short, as expected)
   - `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` → role (`"Employee"` for this test user) — **this is the one non-obvious key**: it lives in a different legacy WIF namespace (`schemas.microsoft.com/ws/2008/06`) than `nameidentifier`/`emailaddress` (`schemas.xmlsoap.org/ws/2005/05`), confirmed by direct decode, not assumed from `EmpoloyeeManagment/Services/TokenService.cs` alone.
7. `EmpoloyeeManagment/Dtos/Users/UserDtos.cs` (backend repo) — exact response shapes: `UserListItemDto(string Id, Role Role, string Email, EmployeeSummaryDto? Employee)`, `EmployeeSummaryDto(int Id, string FirstName, string LastName, EmployeeStatus Status, int? AssignedLocationId)`, `CreateUserRequest(string Email, string Password, string FirstName, string LastName, Gender Gender, Role Role, int? AssignedLocationId)`, `UserResponse(string Id, string Email, Role Role)`. `Role`/`Gender`/`EmployeeStatus` enum members: `Role{Admin,Manager,Supervisor,Employee}`, `Gender{M,F}`, `EmployeeStatus{Active,Inactive}` — serialized as exact-case strings (global `JsonStringEnumConverter`, no naming policy).
8. `src/features/employees/` — full existing feature (`types/employee.types.ts`, `schemas/create-employee.schema.ts` via `signup.schema.ts`'s `buildXSchema(t)` factory pattern, `hooks/use-create-employee.ts`, `components/enum-badge.tsx`, `app/[locale]/(dashboard)/employees/page.tsx` + `new/page.tsx`) — the exact template the new `users` feature (tasks 7–12) mirrors file-for-file. No barrel/`index.ts` files anywhere in this codebase — don't add one.
9. `src/features/auth/lib/map-server-errors.ts` (14 lines) and its use in `signup-form.tsx` (lines 65–79) — the Identity-error-code → form-field map pattern the new `users` create form reuses for its own `POST /api/users` validation errors (same Identity backing store, same error codes).
10. `src/app/[locale]/(dashboard)/layout.tsx` (53 lines) — `DashboardNav` is a hardcoded `<Link>` list (no config array) — add the Users link by hand, gated by `useHasRole("Admin")`.
11. `src/features/employees/components/employee-row-actions.tsx` (whole file, 86 lines) — the Activate/Deactivate dropdown items (lines 49–57) that task 13 wraps in a role check.
12. `messages/en.json` / `messages/ar.json` — top-level namespace shape (`common`, `nav`, `auth`, `employees`, `validation`, `enums`, `statistics`, `errors`). New `users` namespace + `nav.users` + `enums.role.*` follow the exact same nesting.

---

## Product rules (from story)

| Area | Current behavior | New behavior |
|---|---|---|
| `useAuth()` | Returns `{session, isAuthenticated, isInitializing, setSession, logout}` | Adds `role: Role \| null` and `userId: string \| null`, derived via `useMemo` from `session.token` — recomputed only when the token changes, not on every render |
| Employee list Activate/Deactivate | Visible to any authenticated user (backend already 403s non-Admins) | Hidden entirely unless `useHasRole("Admin")` |
| Nav | `Employees` / `Statistics` links only | Adds a `Users` link, visible only to Admin |
| `/users` route | Doesn't exist | New Admin-only list + create screens |

---

## Frontend Tasks

`No backend changes required` — `GET`/`POST /api/users` and the JWT role claim already exist and were verified live (Context item 6).

### 1 — Add the JWT decode utility

**Create file: `src/features/auth/lib/decode-jwt.ts`**

```ts
import type { Role } from "@shared/types/enums";

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const KNOWN_ROLES: Role[] = ["Admin", "Manager", "Supervisor", "Employee"];

export type DecodedToken = {
  userId: string;
  role: Role | null;
};

export function decodeJwtPayload(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64)) as Record<string, unknown>;

    const rawRole = json[ROLE_CLAIM];
    const roleValue = Array.isArray(rawRole) ? rawRole[0] : rawRole;
    const role = KNOWN_ROLES.includes(roleValue as Role) ? (roleValue as Role) : null;

    return { userId: String(json.sub ?? ""), role };
  } catch {
    return null;
  }
}
```

No signature verification — this is UI-only (nav/route gating); the backend remains the sole real authorization boundary on every request. `atob` is a browser global (this file is only ever called from `"use client"` code, same as the rest of `auth/lib/`); no polyfill needed.

### 2 — Add the `Role` type

**File: `src/shared/types/enums.ts`** — append, matching the existing one-liner style:

```ts
export type Role = "Admin" | "Manager" | "Supervisor" | "Employee";
```

### 3 — Wire role/userId into `AuthContext`

**File: `src/features/auth/lib/auth-context.tsx`**

Add the import and derive the fields with `useMemo`, keyed on the token so it's not recomputed every render:

```ts
import { decodeJwtPayload } from "@features/auth/lib/decode-jwt";
```

Inside `AuthProvider`, after the existing `session`/`isInitializing` state:

```ts
const decoded = useMemo(() => (session ? decodeJwtPayload(session.token) : null), [session?.token]);
```

Extend `AuthContextValue` and the provider value:

```ts
type AuthContextValue = {
  session: StoredSession | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  role: Role | null;
  userId: string | null;
  setSession: (session: StoredSession) => void;
  logout: () => void;
};
```

```ts
<AuthContext.Provider
  value={{
    session,
    isAuthenticated: session !== null,
    isInitializing,
    role: decoded?.role ?? null,
    userId: decoded?.userId ?? null,
    setSession,
    logout,
  }}
>
```

Add `import type { Role } from "@shared/types/enums";` and `useMemo` to the existing `react` import.

### 4 — Add `useHasRole` and `RequireRole`

**Create file: `src/features/auth/lib/use-has-role.ts`**

```ts
import type { Role } from "@shared/types/enums";
import { useAuth } from "@features/auth/lib/auth-context";

export function useHasRole(...roles: Role[]): boolean {
  const { role } = useAuth();
  return role !== null && roles.includes(role);
}
```

**Create file: `src/features/auth/components/require-role.tsx`** (mirrors `auth-guard.tsx`'s shape exactly):

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@features/auth/lib/auth-context";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { Skeleton } from "@/components/ui/skeleton";
import type { Role } from "@shared/types/enums";

export function RequireRole({
  roles,
  redirectTo = "/employees",
  children,
}: {
  roles: Role[];
  redirectTo?: string;
  children: React.ReactNode;
}) {
  const { isInitializing } = useAuth();
  const hasRole = useHasRole(...roles);
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !hasRole) {
      router.replace(redirectTo);
    }
  }, [isInitializing, hasRole, redirectTo, router]);

  if (isInitializing) {
    return (
      <div className="flex min-h-32 items-center justify-center p-8">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!hasRole) return null;

  return <>{children}</>;
}
```

`RequireRole` assumes it always renders **inside** `AuthGuard` (so "not authenticated at all" is already handled one layer up) — it only decides role sufficiency, redirecting to `/employees` (a route every role can reach) rather than `/login`.

### 5 — Retrofit `employee-row-actions.tsx`

**File: `src/features/employees/components/employee-row-actions.tsx`**

Add `import { useHasRole } from "@features/auth/lib/use-has-role";` and, at the top of the component body:

```ts
const isAdmin = useHasRole("Admin");
```

Wrap the existing `<DropdownMenuContent>`'s activate/deactivate items (current lines 49–57) so nothing renders for non-Admins:

```tsx
<DropdownMenuContent align="end">
  {isAdmin ? (
    employee.status === "Active" ? (
      <DropdownMenuItem onSelect={() => setConfirmAction("deactivate")}>
        {t("deactivate")}
      </DropdownMenuItem>
    ) : (
      <DropdownMenuItem onSelect={() => setConfirmAction("activate")}>
        {t("activate")}
      </DropdownMenuItem>
    )
  ) : (
    <DropdownMenuItem disabled>{tCommon("noActions")}</DropdownMenuItem>
  )}
</DropdownMenuContent>
```

Add `common.noActions` to both message files (task 14). The dropdown trigger itself stays visible for every role (consistent with `employees` list being visible to all authenticated users) — only its contents change.

### 6 — Add `userKeys` to the shared query-key factory

**File: `src/lib/query-keys.ts`** — append:

```ts
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
};
```

Flat (no `detail(id)`) — there is no `GET /api/users/{id}` on the backend, only list + create.

### 7 — Create the `users` feature: types

**Create file: `src/features/users/types/user.types.ts`**

```ts
import type { EmployeeStatus, Gender, Role } from "@shared/types/enums";

export type EmployeeSummary = {
  id: number;
  firstName: string;
  lastName: string;
  status: EmployeeStatus;
  assignedLocationId: number | null;
};

export type UserListItem = {
  id: string;
  email: string;
  role: Role;
  employee: EmployeeSummary | null;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  role: Role;
};

export type CreateUserResponse = {
  id: string;
  email: string;
  role: Role;
};
```

`assignedLocationId` is kept on the type (mirrors the backend field 1:1) even though no UI sets it yet — avoids a breaking type change when Story 03 adds the picker.

### 8 — `users` feature: create-user schema

**Create file: `src/features/users/schemas/create-user.schema.ts`** — same `buildXSchema(t)` factory shape as `signup.schema.ts`, reusing password rules from that file rather than duplicating them:

```ts
import { z } from "zod";

const buildPasswordSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(6, t("auth.validation.passwordMinLength"))
    .regex(/[A-Z]/, t("auth.validation.passwordUppercase"))
    .regex(/[a-z]/, t("auth.validation.passwordLowercase"))
    .regex(/[0-9]/, t("auth.validation.passwordDigit"))
    .regex(/[^A-Za-z0-9]/, t("auth.validation.passwordSpecialChar"));

export const buildCreateUserSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().trim().min(1, t("validation.required")),
    lastName: z.string().trim().min(1, t("validation.required")),
    email: z.string().trim().min(1, t("validation.required")).email(t("validation.invalidEmail")),
    gender: z.enum(["M", "F"]),
    role: z.enum(["Admin", "Manager", "Supervisor", "Employee"]),
    password: buildPasswordSchema(t),
  });

export type CreateUserInput = z.infer<ReturnType<typeof buildCreateUserSchema>>;
```

`buildPasswordSchema` is duplicated (not imported) from `signup.schema.ts` — that file doesn't export it, and this codebase has no cross-feature import precedent (Context item 8); re-declaring 6 lines is consistent with existing convention over introducing the first one.

### 9 — `users` feature: hooks

**Create file: `src/features/users/hooks/use-users.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { userKeys } from "@/lib/query-keys";
import type { UserListItem } from "@features/users/types/user.types";

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => apiClient.get<UserListItem[]>("/api/users"),
  });
}
```

**Create file: `src/features/users/hooks/use-create-user.ts`**

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { userKeys } from "@/lib/query-keys";
import type { CreateUserRequest, CreateUserResponse } from "@features/users/types/user.types";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserRequest) =>
      apiClient.post<CreateUserResponse>("/api/users", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
```

### 10 — `users` feature: server-error mapping

**Create file: `src/features/users/lib/map-server-errors.ts`** — identical map to `auth/lib/map-server-errors.ts` (same Identity backing store issues the same codes for `POST /api/users` as for signup); duplicated for the same no-cross-feature-import reason as task 8:

```ts
export const CREATE_USER_ERROR_CODE_TO_FIELD: Record<string, "email" | "password"> = {
  DuplicateUserName: "email",
  DuplicateEmail: "email",
  InvalidEmail: "email",
  PasswordTooShort: "password",
  PasswordRequiresDigit: "password",
  PasswordRequiresLower: "password",
  PasswordRequiresUpper: "password",
  PasswordRequiresNonAlphanumeric: "password",
  PasswordRequiresUniqueChars: "password",
};
```

### 11 — `users` feature: role badge

**Create file: `src/features/users/components/role-badge.tsx`** — same shape as `enum-badge.tsx`'s `StatusBadge`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@shared/types/enums";

export function RoleBadge({ value }: { value: Role }) {
  const t = useTranslations("enums.role");
  return <Badge variant={value === "Admin" ? "default" : "outline"}>{t(value)}</Badge>;
}
```

### 12 — `users` feature: pages

**Create file: `src/app/[locale]/(dashboard)/users/page.tsx`** (list — mirrors `employees/page.tsx`'s structure minus filters, which don't apply here):

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RequireRole } from "@features/auth/components/require-role";
import { useUsers } from "@features/users/hooks/use-users";
import { RoleBadge } from "@features/users/components/role-badge";

export default function UsersPage() {
  const t = useTranslations("users");
  const { data: users, isLoading } = useUsers();

  return (
    <RequireRole roles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{t("list.title")}</h1>
          <Button asChild>
            <Link href="/users/new">{t("list.createNew")}</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : users && users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("fields.email")}</TableHead>
                <TableHead>{t("fields.role")}</TableHead>
                <TableHead>{t("fields.employee")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge value={user.role} />
                  </TableCell>
                  <TableCell>
                    {user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">{t("list.noResults")}</p>
        )}
      </div>
    </RequireRole>
  );
}
```

**Create file: `src/app/[locale]/(dashboard)/users/new/page.tsx`** (create form — mirrors `employees/new/page.tsx`):

```tsx
"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { ValidationApiError } from "@/lib/api-errors";
import { RequireRole } from "@features/auth/components/require-role";
import { useCreateUser } from "@features/users/hooks/use-create-user";
import { buildCreateUserSchema, type CreateUserInput } from "@features/users/schemas/create-user.schema";
import { CREATE_USER_ERROR_CODE_TO_FIELD } from "@features/users/lib/map-server-errors";

export default function NewUserPage() {
  const t = useTranslations("users");
  const tFull = useTranslations();
  const tEnums = useTranslations("enums");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const createUser = useCreateUser();

  const schema = useMemo(() => buildCreateUserSchema(tFull), [tFull]);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "M",
      role: "Employee",
      password: "",
    },
  });

  function onSubmit(values: CreateUserInput) {
    createUser.mutate(values, {
      onSuccess: () => {
        toast.success(t("create.success"));
        router.push("/users");
      },
      onError: (error) => {
        if (error instanceof ValidationApiError) {
          let mapped = false;
          for (const code of Object.keys(error.errors)) {
            const field = CREATE_USER_ERROR_CODE_TO_FIELD[code];
            if (field) {
              mapped = true;
              form.setError(field, { message: t(`create.serverErrors.${code}`) });
            }
          }
          if (!mapped) toast.error(t("create.serverErrors.generic"));
        } else {
          toast.error(tErrors("generic"));
        }
      },
    });
  }

  return (
    <RequireRole roles={["Admin"]}>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{t("create.title")}</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.firstName")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.lastName")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.email")}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.gender")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">{tEnums("gender.M")}</SelectItem>
                          <SelectItem value="F">{tEnums("gender.F")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.role")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Admin">{tEnums("role.Admin")}</SelectItem>
                          <SelectItem value="Manager">{tEnums("role.Manager")}</SelectItem>
                          <SelectItem value="Supervisor">{tEnums("role.Supervisor")}</SelectItem>
                          <SelectItem value="Employee">{tEnums("role.Employee")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.password")}</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={createUser.isPending}>
                {t("create.submit")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </RequireRole>
  );
}
```

### 13 — Nav link

**File: `src/app/[locale]/(dashboard)/layout.tsx`**

Add `import { useHasRole } from "@features/auth/lib/use-has-role";` and, inside `DashboardNav`:

```ts
const isAdmin = useHasRole("Admin");
```

Add, after the existing `Statistics` link:

```tsx
{isAdmin && (
  <Link href="/users" className="text-sm font-medium hover:underline">
    {t("users")}
  </Link>
)}
```

### 14 — Translations

**Files: `messages/en.json`, `messages/ar.json`**

Add `"users"` to `"nav"`, `"role"` to `"enums"`, `"noActions"` to `"common"`, and a full new top-level `"users"` namespace mirroring `"employees"`'s `list`/`fields`/`create` shape (no `actions`/`detail` — this story has no row actions or detail view):

```json
"users": {
  "list": { "title": "...", "createNew": "...", "noResults": "..." },
  "fields": { "firstName": "...", "lastName": "...", "email": "...", "gender": "...", "role": "...", "password": "..." },
  "create": {
    "title": "...", "submit": "...", "success": "...",
    "serverErrors": { "DuplicateUserName": "...", "DuplicateEmail": "...", "InvalidEmail": "...",
      "PasswordTooShort": "...", "PasswordRequiresDigit": "...", "PasswordRequiresLower": "...",
      "PasswordRequiresUpper": "...", "PasswordRequiresNonAlphanumeric": "...", "PasswordRequiresUniqueChars": "...",
      "generic": "..." }
  }
}
```

`enums.role` gets `Admin`/`Manager`/`Supervisor`/`Employee` labels in both languages.

---

## Edge Cases & Failure Modes

- **Malformed/unreadable token** — `decodeJwtPayload` wraps the whole decode in `try/catch` and returns `null` on any failure (malformed base64, non-JSON payload, missing `.` separators). `useAuth().role`/`.userId` become `null`, which every gating check (`useHasRole`, `RequireRole`) already treats as "no access" — fails closed, not open.
- **User with zero roles** — backend's `UserListItemDto` construction (`Endpoints/UserEndpoints.cs`) throws server-side (`Enum.Parse<Role>(null!)`) for a role-less user, surfacing as a 500 on `GET /api/users` for that row — this is a pre-existing backend gap (documented, not introduced by this story) and out of scope to fix here; the frontend's `useUsers()` list query will just show a generic error toast if it's ever hit (no orphaned-user seed exists today, so untested in practice).
- **Role changes server-side after login** — per backend `CLAUDE.md`, a role change doesn't take effect until the user's JWT is reissued (re-login); the frontend's decode is a pure function of the stored token, so it inherits this exactly — no additional staleness introduced.
- **`atob` on a token with unicode in claims** — email/name claims here are always ASCII-safe (Identity usernames/emails); no `TextDecoder`/UTF-8 handling added since nothing in this story's claim set needs it.
- **Direct navigation to `/users` or `/users/new` by a non-Admin** — `RequireRole` redirects to `/employees` after `isInitializing` resolves; there's a one-frame flash of the skeleton (same UX as `AuthGuard` today), not a content flash, since `hasRole` is false from the first render (derived synchronously from the already-hydrated session).
- **Multi-role users** — `decodeJwtPayload` takes `rawRole[0]` if the claim decodes as an array (would only happen if a user is ever assigned 2+ roles, which nothing in the backend does today) — documented as a defensive fallback, not a real current case.

---

## Test Plan

No test framework exists in this repo (confirmed in `CLAUDE.md`); verification is manual, browser-based.

1. **Role decode sanity** — already done as part of planning (Context item 6): real signup/login against the local API, decoded token, confirmed exact claim keys.
2. **Admin flow** — log in as an Admin (seed/create one via backend Swagger or `POST /api/users` directly against a running instance if none exists yet). Confirm: `Users` nav link visible; `/users` lists at least the Admin's own account; `/users/new` creates a Manager/Supervisor/Employee successfully and the new row appears after the list re-fetches (`userKeys.lists()` invalidation).
3. **Non-Admin gating** — log in as an Employee (e.g. the throwaway user created during planning). Confirm: no `Users` nav link; direct navigation to `/users` redirects to `/employees`; Employee list's row-actions dropdown shows the disabled "no actions" item instead of Activate/Deactivate.
4. **Validation errors** — on `/users/new`, submit a duplicate email; confirm the error attaches to the `email` field via `CREATE_USER_ERROR_CODE_TO_FIELD`, matching signup's existing behavior.
5. **Regression** — existing `employees`/`statistics`/`auth` flows (login, signup, employee list/create, activate/deactivate as Admin) still work unchanged.

---

## Verification Steps

1. **Frontend builds:** `npm run build` and `npm run lint` from `employee-management-web/`.
2. **Backend runs:** `dotnet run --project EmpoloyeeManagment` (from `EmpoloyeeManagment/`) — already running locally as of this plan (verified live, Context item 6).
3. **Frontend runs:** `npm run dev`; walk through the Test Plan above in-browser for both an Admin and a non-Admin account.
4. **Regression:** confirm `/employees`, `/employees/new`, `/statistics`, `/login`, `/signup` all still render and function.

---

## Done Criteria

- [ ] `useAuth()` exposes `role`/`userId`, derived from the JWT, with `StoredSession`/`setSession()` call sites unchanged.
- [ ] `useHasRole` and `RequireRole` implemented and used by at least the Users screen and the employee row-actions retrofit.
- [ ] `/users` (list) and `/users/new` (create) implemented, Admin-gated, consuming the real `GET`/`POST /api/users`.
- [ ] Employee list Activate/Deactivate hidden for non-Admins.
- [ ] Nav shows `Users` only for Admin.
- [ ] `en.json`/`ar.json` updated and mirrored.
- [ ] Full manual Test Plan (steps 1–5) passes against a local run.

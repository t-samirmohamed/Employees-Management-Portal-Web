"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AuthGuard } from "@features/auth/components/auth-guard";
import { useAuth } from "@features/auth/lib/auth-context";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useLogout } from "@features/auth/hooks/use-logout";
import type { Role } from "@shared/types/enums";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { useEmployeeLookup } from "@/shared/hooks/use-employee-lookup";
import { AttendanceBadge } from "@features/employees/components/enum-badge";
import { NotificationBell } from "@features/notifications/components/notification-bell";

function DashboardNav() {
  const t = useTranslations("nav");
  const { logout } = useAuth();
  const logoutMutation = useLogout();
  const isAdmin = useHasRole("Admin");
  const canSeeClients = useHasRole(...(["Admin", "Manager", "Supervisor"] satisfies Role[]));
  const canSeeNotifications = useHasRole(...(["Admin", "Manager", "Supervisor", "Employee"] satisfies Role[]));
  const { currentEmployee } = useEmployeeLookup();

  function handleLogout() {
    // Client-side logout is immediate and unconditional; the network call is
    // best-effort server-side revocation and must never block signing out locally.
    logout();
    logoutMutation.mutate();
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <nav className="flex items-center gap-4">
        <Link href="/employees" className="text-sm font-medium hover:underline">
          {t("employees")}
        </Link>
        <Link href="/tasks" className="text-sm font-medium hover:underline">
          {t("tasks")}
        </Link>
        <Link href="/visits" className="text-sm font-medium hover:underline">
          {t("visits")}
        </Link>
        <Link href="/leaves" className="text-sm font-medium hover:underline">
          {t("leaves")}
        </Link>
        {canSeeClients && (
          <Link href="/clients" className="text-sm font-medium hover:underline">
            {t("clients")}
          </Link>
        )}
        <Link href="/statistics" className="text-sm font-medium hover:underline">
          {t("statistics")}
        </Link>
        {isAdmin && (
          <Link href="/users" className="text-sm font-medium hover:underline">
            {t("users")}
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-2">
        {currentEmployee && <AttendanceBadge value={currentEmployee.attendanceStatus} />}
        {canSeeNotifications && <NotificationBell />}
        <LanguageSwitcher />
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          {t("logout")}
        </Button>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardNav />
      <main className="p-6">{children}</main>
    </AuthGuard>
  );
}

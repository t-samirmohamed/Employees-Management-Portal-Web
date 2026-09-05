"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AuthGuard } from "@features/auth/components/auth-guard";
import { useAuth } from "@features/auth/lib/auth-context";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { useLogout } from "@features/auth/hooks/use-logout";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { ThemeToggle } from "@/shared/components/theme-toggle";

function DashboardNav() {
  const t = useTranslations("nav");
  const { logout } = useAuth();
  const logoutMutation = useLogout();
  const isAdmin = useHasRole("Admin");

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

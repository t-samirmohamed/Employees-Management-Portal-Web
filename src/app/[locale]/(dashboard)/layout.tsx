"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
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

const COLLAPSED_STORAGE_KEY = "sidebar:collapsed";

type NavItem = { href: string; labelKey: string; icon: LucideIcon };

function useNavItems(): NavItem[] {
  const isAdmin = useHasRole("Admin");
  const canSeeClients = useHasRole(...(["Admin", "Manager", "Supervisor"] satisfies Role[]));

  return [
    { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { href: "/employees", labelKey: "employees", icon: Users },
    { href: "/tasks", labelKey: "tasks", icon: ListChecks },
    { href: "/visits", labelKey: "visits", icon: MapPin },
    { href: "/leaves", labelKey: "leaves", icon: CalendarDays },
    ...(canSeeClients ? [{ href: "/clients", labelKey: "clients", icon: Building2 }] : []),
    ...(isAdmin ? [{ href: "/users", labelKey: "users", icon: UserCog }] : []),
  ];
}

// Label is shown inline when expanded; when collapsed the item is icon-only and
// the label moves into a tooltip on the side facing the content.
function SidebarItem({
  collapsed,
  label,
  icon: Icon,
  active,
  children,
}: {
  collapsed: boolean;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  children: (content: React.ReactNode, className: string) => React.ReactElement;
}) {
  const locale = useLocale();
  const className = cn(
    "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
    collapsed && "justify-center px-0"
  );
  const content = (
    <>
      <Icon className="size-5 shrink-0" />
      <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
    </>
  );
  const element = children(content, className);

  if (!collapsed) return element;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent side={locale === "ar" ? "left" : "right"}>{label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarNav({
  collapsed,
  onNavigate,
  onLogout,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const items = useNavItems();

  return (
    <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <SidebarItem
              key={item.href}
              collapsed={collapsed}
              label={t(item.labelKey)}
              icon={item.icon}
              active={active}
            >
              {(content, className) => (
                <Link
                  href={item.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {content}
                </Link>
              )}
            </SidebarItem>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-sidebar-border pt-2">
        <SidebarItem collapsed={collapsed} label={t("logout")} icon={LogOut}>
          {(content, className) => (
            <button type="button" className={className} onClick={onLogout}>
              {content}
            </button>
          )}
        </SidebarItem>
      </div>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const { logout } = useAuth();
  const logoutMutation = useLogout();
  const canSeeNotifications = useHasRole(...(["Admin", "Manager", "Supervisor", "Employee"] satisfies Role[]));
  const { currentEmployee } = useEmployeeLookup();
  // Safe to read storage during render: AuthGuard only mounts this after
  // client-side auth hydration, so it never renders on the server.
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function handleLogout() {
    // Client-side logout is immediate and unconditional; the network call is
    // best-effort server-side revocation and must never block signing out locally.
    logout();
    logoutMutation.mutate();
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-svh">
        {/* Desktop: persistent drawer that collapses to an icon rail */}
        <aside
          className={cn(
            "sticky top-0 hidden h-svh shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-foreground transition-[width] duration-200 md:flex",
            collapsed ? "w-16" : "w-60"
          )}
        >
          <div
            className={cn(
              "flex h-14 items-center border-b border-sidebar-border px-3",
              collapsed ? "justify-center" : "justify-between"
            )}
          >
            {!collapsed && <span className="truncate font-semibold">{t("common.appName")}</span>}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleCollapsed}
              aria-label={collapsed ? t("nav.expandMenu") : t("nav.collapseMenu")}
              aria-expanded={!collapsed}
            >
              {collapsed ? (
                <PanelLeftOpen className="rtl:rotate-180" />
              ) : (
                <PanelLeftClose className="rtl:rotate-180" />
              )}
            </Button>
          </div>
          <SidebarNav collapsed={collapsed} onLogout={handleLogout} />
        </aside>

        {/* Mobile: off-canvas drawer, always expanded */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 start-0 flex w-64 flex-col border-e border-sidebar-border bg-sidebar text-foreground shadow-lg">
              <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
                <span className="truncate font-semibold">{t("common.appName")}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMobileOpen(false)}
                  aria-label={t("nav.collapseMenu")}
                >
                  <X />
                </Button>
              </div>
              <SidebarNav
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
                onLogout={handleLogout}
              />
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between gap-2 border-b px-4 md:justify-end md:px-6">
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label={t("nav.openMenu")}
            >
              <Menu />
            </Button>
            <div className="flex items-center gap-2">
              {currentEmployee && <AttendanceBadge value={currentEmployee.attendanceStatus} />}
              {canSeeNotifications && <NotificationBell />}
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}

"use client";

import { useEffect } from "react";
import { useAuth } from "@features/auth/lib/auth-context";
import { useRouter } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { ThemeToggle } from "@/shared/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isInitializing, isAuthenticated, router]);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-end gap-2 p-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-8">{children}</main>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@features/auth/lib/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing) {
    return (
      <div className="flex min-h-svh items-center justify-center p-8">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

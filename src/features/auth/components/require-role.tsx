"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@features/auth/lib/auth-context";
import { useHasRole } from "@features/auth/lib/use-has-role";
import { Skeleton } from "@/components/ui/skeleton";
import type { Role } from "@shared/types/enums";

// Assumes it always renders inside AuthGuard — "not authenticated at all" is
// already handled one layer up; this only decides role sufficiency.
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

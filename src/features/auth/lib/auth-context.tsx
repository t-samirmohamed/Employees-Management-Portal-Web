"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { AUTH_SESSION_EXPIRED_EVENT } from "@/lib/api-errors";
import { decodeJwtPayload } from "@features/auth/lib/decode-jwt";
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
  type StoredSession,
} from "@features/auth/lib/token-storage";
import type { Role } from "@shared/types/enums";

type AuthContextValue = {
  session: StoredSession | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  role: Role | null;
  userId: string | null;
  setSession: (session: StoredSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<StoredSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const t = useTranslations("errors");

  const token = session?.token;
  const decoded = useMemo(() => (token ? decodeJwtPayload(token) : null), [token]);

  useEffect(() => {
    setSessionState(getStoredSession());
    setIsInitializing(false);
  }, []);

  const setSession = useCallback((next: StoredSession) => {
    setStoredSession(next);
    setSessionState(next);
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setSessionState(null);
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      logout();
      toast.error(t("sessionExpired"));
      router.replace("/login");
    }
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [logout, router, t]);

  return (
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
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

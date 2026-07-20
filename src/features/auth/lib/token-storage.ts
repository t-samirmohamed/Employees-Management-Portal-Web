const STORAGE_KEY = "employee-management:auth-session";

export type StoredSession = {
  token: string;
  expiresAtUtc: string;
  email: string;
};

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as StoredSession;
    if (new Date(session.expiresAtUtc).getTime() <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function getStoredToken(): string | null {
  return getStoredSession()?.token ?? null;
}

export function setStoredSession(session: StoredSession): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

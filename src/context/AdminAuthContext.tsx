import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { nhost } from "../nhost";

interface AdminAuthContextValue {
  isAuthenticated: boolean | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  // Start with null (unknown) so we can show a loading state while
  // checking for an existing session, avoiding a flash of the login screen.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  // On mount, restore session from Nhost localStorage if one exists
  useEffect(() => {
    const session = nhost.getUserSession();
    setIsAuthenticated(!!session);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError("");
    try {
      const { body } = await nhost.auth.signInEmailPassword({ email, password });
      if ((body as Record<string, unknown>)?.session) {
        setIsAuthenticated(true);
        return true;
      }
      setError("Credenziali non valide. Riprova.");
      return false;
    } catch (err: unknown) {
      const error = err as Record<string, unknown> | undefined;
      const msg =
        (error?.body as Record<string, unknown>)?.message as string ||
        (error?.message as string) ||
        "Errore di accesso. Riprova.";
      setError(msg);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const session = nhost.getUserSession();
      if (session?.refreshTokenId) {
        await nhost.auth.signOut({ refreshToken: session.refreshTokenId });
      }
    } catch {
      // best-effort sign-out
    } finally {
      nhost.clearSession();
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}

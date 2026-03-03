import { createContext, useContext, useState, useEffect } from "react";
import { nhost } from "../nhost";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  // Start with null (unknown) so we can show a loading state while
  // checking for an existing session, avoiding a flash of the login screen.
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [error, setError] = useState("");

  // On mount, restore session from Nhost localStorage if one exists
  useEffect(() => {
    const session = nhost.getUserSession();
    setIsAuthenticated(!!session);
  }, []);

  const login = async (email, password) => {
    setError("");
    try {
      const { body } = await nhost.auth.signInEmailPassword({ email, password });
      if (body?.session) {
        setIsAuthenticated(true);
        return true;
      }
      setError("Credenziali non valide. Riprova.");
      return false;
    } catch (err) {
      const msg =
        err?.body?.message ||
        err?.message ||
        "Errore di accesso. Riprova.";
      setError(msg);
      return false;
    }
  };

  const logout = async () => {
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

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

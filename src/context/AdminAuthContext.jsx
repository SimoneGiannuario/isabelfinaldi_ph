import { createContext, useContext, useState } from "react";

// ── Change this to set a different admin password ──────────────────────────
const ADMIN_PASSWORD = "isabel2026";
// ──────────────────────────────────────────────────────────────────────────

const SESSION_KEY = "isf_admin_auth";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [error, setError] = useState("");

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
      setError("");
      return true;
    }
    setError("Password errata. Riprova.");
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
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

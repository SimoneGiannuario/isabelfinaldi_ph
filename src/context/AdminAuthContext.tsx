import { createContext, useContext, useState, type ReactNode } from "react";
// The base URL for the Cloudflare API
const API_URL = import.meta.env.VITE_CLOUDFLARE_API_URL || 'http://localhost:8787';

interface AdminAuthContextValue {
  isAuthenticated: boolean | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (!token) return false;
      
      try {
        // Decode the payload of the JWT token
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr);
        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("admin_token");
          return false;
        }
        return true;
      } catch (e) {
        // If decoding fails, the token is invalid format
        localStorage.removeItem("admin_token");
        return false;
      }
    }
    return null;
  });
  const [error, setError] = useState("");

  const login = async (email: string, password: string): Promise<boolean> => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
        return true;
      }

      setError(data.error || "Credenziali non valide. Riprova.");
      return false;
    } catch (err: unknown) {
      setError("Errore di rete. Riprova.");
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
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

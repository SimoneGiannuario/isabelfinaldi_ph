import { AdminAuthProvider, useAdminAuth } from "../../context/AdminAuthContext";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./AdminPage.css";

function AdminInner() {
  const { isAuthenticated } = useAdminAuth();

  // null = still checking session (avoids flash of login screen)
  if (isAuthenticated === null) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-card" style={{ textAlign: "center", color: "var(--adm-muted)" }}>
          Caricamento…
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}

// AdminPage wraps itself in its own provider so admin auth is isolated
export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminInner />
    </AdminAuthProvider>
  );
}

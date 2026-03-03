import { AdminAuthProvider, useAdminAuth } from "../../context/AdminAuthContext";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./AdminPage.css";

function AdminInner() {
  const { isAuthenticated } = useAdminAuth();
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

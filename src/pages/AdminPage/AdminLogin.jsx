import { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const { login, error } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(password);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <h1>Isabel <span>Finaldi</span></h1>
          <p>Area Amministrativa</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-pass">Password</label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoFocus
              required
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? "Accesso..." : "Accedi →"}
          </button>
        </form>
        <a href="/" className="admin-back-link">← Torna al sito</a>
      </div>
    </div>
  );
}

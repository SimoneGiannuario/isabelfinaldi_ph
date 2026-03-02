import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Link to="/" className="nav-logo">
          Isabel <span>Finaldi</span>
        </Link>
        <p>© 2026 Isabel Finaldi Photography. All rights reserved.</p>
      </div>
    </footer>
  );
}

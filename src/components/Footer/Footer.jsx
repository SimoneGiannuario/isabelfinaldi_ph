import { Link } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import "./Footer.css";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="container">
        <Link to="/" className="nav-logo">
          Isabel <span>Finaldi</span>
        </Link>
        <p>{t.footer.rights}</p>
      </div>
    </footer>
  );
}

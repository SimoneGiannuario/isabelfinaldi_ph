import { Link } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import "./Footer.css";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
      <div className="container">
        <Link to="/" className="nav-logo" aria-label="Naitiry — Torna alla home">
          Nai<span>tiry</span>
        </Link>
        <p>{t.footer.rights}</p>
      </div>
    </footer>
  );
}

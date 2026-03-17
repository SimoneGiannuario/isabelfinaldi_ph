import { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import { useLang } from "../../context/LanguageContext";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const { lang } = useLang();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [lang]);

  const title = lang === "it" ? "Pagina non trovata | Naitiry" : "Page Not Found | Naitiry";

  return (
    <>
      <SEO 
        title={title}
        description="Errore 404 - La pagina non esiste o è stata rimossa."
        noindex={true}
      />
      <div className="not-found-container reveal revealed">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">
          {lang === "it"
            ? "Ops! La pagina che stai cercando non esiste o è stata rimossa."
            : "Oops! The page you are looking for does not exist or has been removed."}
        </p>
        <Link to="/" className="not-found-btn">
          {lang === "it" ? "Torna alla Home" : "Return to Home"}
        </Link>
      </div>
    </div>
    </>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const { lang } = useLang();

  useEffect(() => {
    // 1. Inject noindex meta tag for SEO
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    let created = false;
    let originalContent = "";

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
      created = true;
    } else {
      originalContent = meta.content;
    }

    meta.content = "noindex, nofollow";

    // 2. Set page title
    const originalTitle = document.title;
    document.title =
      lang === "it"
        ? "Pagina non trovata | Naitiry"
        : "Page Not Found | Naitiry";

    return () => {
      // Cleanup on unmount
      if (created) {
        document.head.removeChild(meta);
      } else {
        meta.content = originalContent;
      }
      document.title = originalTitle;
    };
  }, [lang]);

  return (
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
  );
}

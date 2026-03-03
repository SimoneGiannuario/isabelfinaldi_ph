import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import "./Navbar.css";

export default function Navbar() {
  const { lang, t, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            Isabel <span>Finaldi</span>
          </Link>
          <ul className="nav-links">
            <li><NavLink to="/" end>{t.nav.home}</NavLink></li>
            <li><a href="/#featured" onClick={closeMenu}>{t.nav.portfolio}</a></li>
            <li><a href="/#about" onClick={closeMenu}>{t.nav.about}</a></li>
            <li><a href="/#contact" onClick={closeMenu}>{t.nav.contact}</a></li>
            <li><NavLink to="/gallery">{t.nav.gallery}</NavLink></li>
          </ul>
          <div className="nav-right">
            <button
              className="lang-toggle"
              onClick={toggle}
              aria-label="Switch language"
              title={lang === "it" ? "Switch to English" : "Passa all'Italiano"}
            >
              {lang === "it" ? "EN" : "IT"}
            </button>
            <button
              className={`hamburger${menuOpen ? " active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
        <Link to="/" onClick={closeMenu}>{t.nav.home}</Link>
        <a href="/#featured" onClick={closeMenu}>{t.nav.portfolio}</a>
        <a href="/#about" onClick={closeMenu}>{t.nav.about}</a>
        <a href="/#contact" onClick={closeMenu}>{t.nav.contact}</a>
        <Link to="/gallery" onClick={closeMenu}>{t.nav.gallery}</Link>
        <button className="lang-toggle lang-toggle--mobile" onClick={toggle}>
          {lang === "it" ? "🇬🇧 English" : "🇮🇹 Italiano"}
        </button>
      </div>
    </>
  );
}

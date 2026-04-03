import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLang } from "../../context/LanguageContext";
import "./Navbar.css";

export default function Navbar() {
  const { lang, t, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
    // Return focus to hamburger when closing
    hamburgerRef.current?.focus();
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
    // When opening, focus the first link inside the menu
    if (next) {
      setTimeout(() => {
        const firstLink = menuRef.current?.querySelector("a") as HTMLElement | null;
        firstLink?.focus();
      }, 100);
    }
  };

  // Trap focus inside mobile menu when open
  useEffect(() => {
    if (!menuOpen) return;
    const menu = menuRef.current;
    if (!menu) return;

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`navbar${scrolled ? " scrolled" : ""}`}
        role="navigation"
        aria-label={t.nav.home ? "Menu principale" : "Main navigation"}
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <div className="container">
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <img src={`${import.meta.env.BASE_URL}images/logo1.webp`} alt="Naitiry" className="nav-logo-img" fetchPriority="high" />
          </Link>
          <ul className="nav-links" role="list">
            <li><NavLink to="/" end>{t.nav.home}</NavLink></li>
            <li><a href="/#featured" onClick={closeMenu}>{t.nav.portfolio}</a></li>
            <li><a href="/#about" onClick={closeMenu}>{t.nav.about}</a></li>
            <li><a href="/#contact" onClick={closeMenu}>{t.nav.contact}</a></li>
            <li><NavLink to="/gallery">{t.nav.gallery}</NavLink></li>
            <li><NavLink to="/pricelist">{t.nav.pricelist}</NavLink></li>
          </ul>
          <div className="nav-right">
            <button
              className="lang-toggle"
              onClick={toggle}
              aria-label={lang === "it" ? "Switch to English" : "Passa all'Italiano"}
            >
              {lang === "it" ? "EN" : "IT"}
            </button>
            <button
              ref={hamburgerRef}
              className={`hamburger${menuOpen ? " active" : ""}`}
              onClick={toggleMenu}
              aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
      >
        <Link to="/" onClick={closeMenu}>{t.nav.home}<span className="sr-only"> (Mobile)</span></Link>
        <a href="/#featured" onClick={closeMenu}>{t.nav.portfolio}<span className="sr-only"> (Mobile)</span></a>
        <a href="/#about" onClick={closeMenu}>{t.nav.about}<span className="sr-only"> (Mobile)</span></a>
        <a href="/#contact" onClick={closeMenu}>{t.nav.contact}<span className="sr-only"> (Mobile)</span></a>
        <Link to="/gallery" onClick={closeMenu}>{t.nav.gallery}<span className="sr-only"> (Mobile)</span></Link>
        <Link to="/pricelist" onClick={closeMenu}>{t.nav.pricelist}<span className="sr-only"> (Mobile)</span></Link>
        <button className="lang-toggle lang-toggle--mobile" onClick={toggle}>
          {lang === "it" ? "🇬🇧 English" : "🇮🇹 Italiano"}
        </button>
      </div>
    </>
  );
}

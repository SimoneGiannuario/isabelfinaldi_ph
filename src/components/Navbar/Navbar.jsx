import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
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
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><a href="/#featured" onClick={closeMenu}>Portfolio</a></li>
            <li><a href="/#about" onClick={closeMenu}>About</a></li>
            <li><a href="/#contact" onClick={closeMenu}>Contact</a></li>
            <li><NavLink to="/gallery">Gallery</NavLink></li>
          </ul>
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
      </nav>

      {/* Mobile overlay menu */}
      <div className={`mobile-menu${menuOpen ? " active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <a href="/#featured" onClick={closeMenu}>Portfolio</a>
        <a href="/#about" onClick={closeMenu}>About</a>
        <a href="/#contact" onClick={closeMenu}>Contact</a>
        <Link to="/gallery" onClick={closeMenu}>Gallery</Link>
      </div>
    </>
  );
}

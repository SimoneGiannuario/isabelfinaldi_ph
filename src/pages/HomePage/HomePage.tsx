import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNhostPhotos } from "../../hooks/useNhostPhotos";
import { useScrollReveal, useLightbox } from "../../hooks/usePortfolio";
import { useLang } from "../../context/LanguageContext";
import { getSrcSet, getOptimizedUrl } from "../../data/photos";
import Lightbox from "../../components/Lightbox/Lightbox";
import "./HomePage.css";

export default function HomePage() {
  const { t } = useLang();
  const { allPhotos } = useNhostPhotos();
  const featured = useMemo(() => allPhotos.filter((p) => p.featured).sort((a, b) => b.votes - a.votes), [allPhotos]);
  const lightbox = useLightbox(featured);
  useScrollReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Isabel Finaldi — Fotografa | Portfolio";
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img
            src={`${import.meta.env.BASE_URL}images/landscape_sunset.webp`}
            srcSet={getSrcSet(`${import.meta.env.BASE_URL}images/landscape_sunset.webp`)}
            sizes="100vw"
            alt="Hero background" fetchPriority="high" loading="eager" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">{t.hero.eyebrow}</p>
          <h1 className="hero-title">
            {t.hero.title1} <em>{t.hero.title2}</em>
          </h1>
          <p className="hero-description">{t.hero.description}</p>
          <Link to="/gallery" className="hero-cta">
            {t.hero.cta}
          </Link>
        </div>
        <div className="hero-scroll-indicator">
          <span>{t.hero.scroll}</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* FEATURED PHOTOS */}
      <section className="section" id="featured">
        <div className="container">
          <p className="section-subtitle reveal">{t.featured.subtitle}</p>
          <h2 className="section-title reveal">
            {t.featured.title1} <em>{t.featured.title2}</em>
          </h2>
          <div className="section-divider reveal" />
          <div className="featured-grid">
            {featured.map((photo, index) => {
              const srcSet = getSrcSet(photo.src);

              const base = getOptimizedUrl(photo.src);

              return (<div
                key={photo.id}
                className={`photo-card reveal reveal-delay-${(index % 4) + 1}${index === 0 ? " tall" : ""}`}
                onClick={() => lightbox.open(index, featured)}
              >
                <img
                  src={`${base}`}
                  srcSet={srcSet}
                  sizes="(max-width: 600px) 100vw, 50vw"
                  alt={photo.title} loading="lazy" />
                <div className="photo-card-overlay">
                  <h3 className="photo-card-title">{photo.title}</h3>
                  <div className="photo-card-meta">
                    <span>{photo.category}</span>
                    <span>{photo.shootingName}</span>
                    <span className="votes">♥ {photo.votes}</span>
                  </div>
                </div>
              </div>)
            }

            )}
          </div>
          <div className="featured-cta reveal">
            <Link to="/gallery" className="hero-cta">
              {t.featured.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image reveal">
              <img
                src={`${import.meta.env.BASE_URL}images/portrait_golden_hour.webp`}
                srcSet={getSrcSet(`${import.meta.env.BASE_URL}images/portrait_golden_hour.webp`)}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Isabel Finaldi" />
            </div>
            <div className="about-text">
              <p className="section-subtitle reveal">{t.about.subtitle}</p>
              <h2 className="section-title reveal">
                {t.about.title1}<br /><em>{t.about.title2}</em>
              </h2>
              <div className="section-divider reveal" />
              <p className="reveal">{t.about.paragraph1}</p>
              <p className="reveal">{t.about.paragraph2}</p>
              <div className="about-stats reveal">
                <div className="stat-item">
                  <h4>150+</h4>
                  <p>{t.about.stat1Label}</p>
                </div>
                <div className="stat-item">
                  <h4>3</h4>
                  <p>{t.about.stat2Label}</p>
                </div>
                <div className="stat-item">
                  <h4>50+</h4>
                  <p>{t.about.stat3Label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <p className="section-subtitle reveal">{t.contact.subtitle}</p>
              <h2 className="section-title reveal">
                {t.contact.title1}<br /><em>{t.contact.title2}</em>
              </h2>
              <div className="section-divider reveal" />
              <p className="reveal">{t.contact.paragraph}</p>
              <div className="contact-details reveal">
                <a href="mailto:hello@isabelfinaldi.com">
                  <span className="icon">✉</span> hello@isabelfinaldi.com
                </a>
                <a href="tel:+393451234567">
                  <span className="icon">☏</span> +39 345 123 4567
                </a>
                <span className="contact-location">
                  <span className="icon">◎</span> {t.contact.location}
                </span>
              </div>
              <div className="social-links reveal">
                <a href="#" aria-label="Instagram">IG</a>
              </div>
            </div>
            <form
              className="contact-form reveal"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! (Demo)");
              }}
            >
              <div className="form-group">
                <label htmlFor="contact-name" className="sr-only">{t.contact.namePlaceholder}</label>
                <input type="text" placeholder={t.contact.namePlaceholder} required id="contact-name" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email" className="sr-only">{t.contact.emailPlaceholder}</label>
                <input type="email" placeholder={t.contact.emailPlaceholder} required id="contact-email" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject" className="sr-only">{t.contact.subjectPlaceholder}</label>
                <input type="text" placeholder={t.contact.subjectPlaceholder} id="contact-subject" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message" className="sr-only">{t.contact.messagePlaceholder}</label>
                <textarea placeholder={t.contact.messagePlaceholder} required id="contact-message" />
              </div>
              <button type="submit" className="btn-submit" id="contact-submit">
                {t.contact.sendButton}
              </button>
            </form>
          </div>
        </div>
      </section>

      {lightbox.isOpen && (
        <Lightbox
          photo={lightbox.currentPhoto}
          onClose={lightbox.close}
          onPrev={() => lightbox.navigate(-1)}
          onNext={() => lightbox.navigate(1)}
          currentIndex={lightbox.index + 1}
          totalPhotos={featured.length}
        />
      )}
    </>
  );
}

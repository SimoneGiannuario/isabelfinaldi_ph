import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNhostPhotos } from "../../hooks/useNhostPhotos";
import { useScrollReveal, useLightbox } from "../../hooks/usePortfolio";
import { useLang } from "../../context/LanguageContext";
import { getSrcSet, getOptimizedUrl } from "../../data/photos";
import Lightbox from "../../components/Lightbox/Lightbox";
import SEO from "../../components/SEO/SEO";
import "./HomePage.css";

export default function HomePage() {
  const { t } = useLang();
  const { allPhotos } = useNhostPhotos();
  const featured = useMemo(() => allPhotos.filter((p) => p.featured).sort((a, b) => b.votes - a.votes), [allPhotos]);
  const lightbox = useLightbox(featured);
  useScrollReveal();

  const [currentAboutImage, setCurrentAboutImage] = useState(0);
  const aboutImages = ['Isabel-web.jpeg', 'Isabel-web1.jpeg', 'Isabel-web2.jpeg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAboutImage((prev) => (prev + 1) % aboutImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [aboutImages.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Naitiry - Isabel Finaldi Photography",
    "image": "https://naitiry.com/images/tower-bridge.jpg",
    "description": "Portfolio fotografico professionale di Naitiry, fotografa a Foggia. Ritratti, paesaggi, street photography, eventi e progetti creativi.",
    "url": "https://naitiry.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Foggia",
      "addressRegion": "Puglia",
      "addressCountry": "IT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.4623",
      "longitude": "15.5447"
    },
    "priceRange": "$$"
  };

  return (
    <>
      <SEO
        title="Naitiry — Fotografa a Foggia | Portfolio Professionale"
        description="Portfolio fotografico professionale di Naitiry. Ritratti, paesaggi, street photography, eventi e progetti creativi disponibili in tutta la provincia di Foggia."
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img
            src={getOptimizedUrl(`${import.meta.env.BASE_URL}images/tower-bridge.jpg`, 1440)}
            srcSet={getSrcSet(`${import.meta.env.BASE_URL}images/tower-bridge.jpg`)}
            sizes="100vw"
            alt="Hero background" fetchPriority="high" loading="eager" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">{t.hero.eyebrow}</p>
          <h1 className="hero-title">
            {t.hero.title1}
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
                  sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1024px) 50vw, 33vw"
                  alt={photo.title} loading="lazy" />
                <div className="photo-card-overlay">
                  <h3 className="photo-card-title">{photo.title}</h3>
                  <div className="photo-card-meta">
                    <span>{t.gallery.categories[photo.category] || photo.category}</span>
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
              {aboutImages.map((img, index) => {
                const imgPath = `${import.meta.env.BASE_URL}images/${img}`;
                return (
                  <img
                    key={img}
                    src={getOptimizedUrl(imgPath, 600)}
                    srcSet={getSrcSet(imgPath)}
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    alt={`Isabel Finaldi ${index + 1}`}
                    className={index === currentAboutImage ? 'active' : ''}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                );
              })}
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
                  <h3>150+</h3>
                  <p>{t.about.stat1Label}</p>
                </div>
                <div className="stat-item">
                  <h3>3</h3>
                  <p>{t.about.stat2Label}</p>
                </div>
                <div className="stat-item">
                  <h3>50+</h3>
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
                <a href="mailto:naitiry.ph@gmail.com">
                  <span className="icon">✉</span> naitiry.ph@gmail.com
                </a>
                <a href="tel:+393514791225">
                  <span className="icon">☏</span> +39 351 479 1225
                </a>
                <span className="contact-location">
                  <span className="icon">◎</span> {t.contact.location}
                </span>
              </div>
              <div className="social-links reveal">
                <a href="#" aria-label="Instagram">IG</a>
                <a href="https://wa.me/393514791225" aria-label="Whatsapp">WA</a>
              </div>
            </div>
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

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
    "name": "Naitiry Photography",
    "image": "https://naitiry.com/images/tower-bridge.jpg",
    "description": "Portfolio fotografico professionale di Naitiry, fotografa a Foggia. Ritratti, paesaggi, street photography, eventi e progetti creativi.",
    "url": "https://naitiry.com",
    "logo": "https://naitiry.com/images/logo1.webp",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Foggia",
      "addressRegion": "Puglia",
      "addressCountry": "IT",
      "postalCode": "71121",
      "streetAddress": ""
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.4623",
      "longitude": "15.5447"
    },
    "telephone": "+393514791225",
    "priceRange": "$$"
  };

  return (
    <div itemScope itemType="https://schema.org/ProfessionalService">
      <meta itemProp="name" content="Naitiry Photography" />
      <meta itemProp="url" content="https://naitiry.com" />
      <meta itemProp="image" content="https://naitiry.com/images/tower-bridge.jpg" />
      <meta itemProp="description" content="Portfolio fotografico professionale di Naitiry, fotografa a Foggia. Ritratti, paesaggi, street photography, eventi e progetti creativi." />
      <meta itemProp="priceRange" content="$$" />
      <meta itemProp="logo" content="https://naitiry.com/images/logo1.webp" />
      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
        <meta itemProp="addressLocality" content="Foggia" />
        <meta itemProp="addressRegion" content="Puglia" />
        <meta itemProp="addressCountry" content="IT" />
      </div>
      <div itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates">
        <meta itemProp="latitude" content="41.4623" />
        <meta itemProp="longitude" content="15.5447" />
      </div>
      <SEO
        title="Naitiry — Fotografa a Foggia | Portfolio Professionale"
        description="Scopri il portfolio fotografico di Naitiry: ritratti, paesaggi, street, eventi e progetti creativi. Fotografa professionista a Foggia e provincia."
      />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* HERO */}
      <section className="hero" id="hero" itemProp="mainEntity" itemScope itemType="https://schema.org/ImageObject">
        <div className="hero-bg">
          <img
            src={getOptimizedUrl(`${import.meta.env.BASE_URL}images/tower-bridge.jpg`, 1440)}
            srcSet={getSrcSet(`${import.meta.env.BASE_URL}images/tower-bridge.jpg`)}
            sizes="(max-width: 768px) 100vw, 100vw"
            alt="Hero background" fetchPriority="high" loading="eager" itemProp="contentUrl" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-eyebrow">{t.hero.eyebrow}</h1>
          <h2 className="hero-title">
            {t.hero.title1}
          </h2>
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
      <section className="section" id="featured" itemScope itemType="https://schema.org/ImageGallery">
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
                itemProp="image" itemScope itemType="https://schema.org/ImageObject"
              >
                <img
                  src={`${base}`}
                  srcSet={srcSet}
                  sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1024px) 50vw, 33vw"
                  alt={(photo.title || photo.category).replace(/_/g, ' ')}
                  title={(photo.title || photo.category).replace(/_/g, ' ')}
                  loading="lazy"
                  itemProp="contentUrl" />
                <meta itemProp="name" content={(photo.title || photo.category).replace(/_/g, ' ')} />
                <meta itemProp="description" content={`${photo.category} — ${photo.shootingName}`} />
                <div className="photo-card-overlay">
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
      <section className="section about-section" id="about" itemProp="founder" itemScope itemType="https://schema.org/Person">
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
                    sizes="(max-width: 448px) calc(100vw - 48px), (max-width: 768px) 400px, 50vw"
                    alt={`Naitiry ${index + 1}`}
                    itemProp="image"
                    className={index === currentAboutImage ? 'active' : ''}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                );
              })}
            </div>
            <div className="about-text">
              <meta itemProp="name" content="Naitiry" />
              <meta itemProp="jobTitle" content="Fotografa professionista" />
              <meta itemProp="url" content="https://naitiry.com" />
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
      <section className="section" id="contact" itemProp="contactPoint" itemScope itemType="https://schema.org/ContactPoint">
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
                <meta itemProp="contactType" content="customer service" />
                <a href="mailto:naitiry.ph@gmail.com" itemProp="email">
                  <span className="icon">✉</span> naitiry.ph@gmail.com
                </a>
                <a href="tel:+393514791225" itemProp="telephone">
                  <span className="icon">☏</span> +39 351 479 1225
                </a>
                <span className="contact-location">
                  <span className="icon">◎</span> {t.contact.location}
                </span>
              </div>
              <div className="social-links reveal" style={{ flexWrap: 'wrap' }}>
                <a href="https://www.instagram.com/naitiry.ph/" aria-label="Instagram" itemProp="sameAs">IG</a>
                <a href="https://www.facebook.com/profile.php?id=61576485123692" aria-label="Facebook" itemProp="sameAs">FB</a>
                <a href="https://www.tiktok.com/@naitiry.ph?lang=it-IT" aria-label="Tiktok" itemProp="sameAs">TK</a>
                <a href="https://wa.me/393514791225" aria-label="Whatsapp" itemProp="sameAs">WA</a>
                <a href="tel:+393514791225" aria-label="Phone" itemProp="telephone" style={{ width: 'auto', padding: '0 1rem', borderRadius: '22px', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>☏</span> +39 351 479 1225
                </a>
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
    </div>
  );
}

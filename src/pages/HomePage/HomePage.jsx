import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeaturedPhotos } from "../../data/photos";
import { useScrollReveal, useLightbox } from "../../hooks/usePortfolio";
import Lightbox from "../../components/Lightbox/Lightbox";
import "./HomePage.css";

export default function HomePage() {
  const featured = getFeaturedPhotos();
  const lightbox = useLightbox(featured);
  useScrollReveal();

  // Reset scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img src="/images/landscape_sunset.png" alt="Hero background" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Photography Portfolio</p>
          <h1 className="hero-title">
            Isabel <em>Finaldi</em>
          </h1>
          <p className="hero-description">
            Capturing emotions, light, and stories through the lens. Based in Italy, available worldwide.
          </p>
          <Link to="/gallery" className="hero-cta">
            Explore My Work →
          </Link>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* FEATURED PHOTOS */}
      <section className="section" id="featured">
        <div className="container">
          <p className="section-subtitle reveal">Most Loved</p>
          <h2 className="section-title reveal">
            Featured <em>Work</em>
          </h2>
          <div className="section-divider reveal" />
          <div className="featured-grid">
            {featured.map((photo, index) => (
              <div
                key={photo.id}
                className={`photo-card reveal reveal-delay-${(index % 4) + 1}${index === 0 ? " tall" : ""}`}
                onClick={() => lightbox.open(index, featured)}
              >
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <div className="photo-card-overlay">
                  <h3 className="photo-card-title">{photo.title}</h3>
                  <div className="photo-card-meta">
                    <span>{photo.category}</span>
                    <span>{photo.shootingName}</span>
                    <span className="votes">♥ {photo.votes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="featured-cta reveal">
            <Link to="/gallery" className="hero-cta">
              View Full Gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image reveal">
              <img src="/images/portrait_golden_hour.png" alt="Isabel Finaldi — Photographer" />
            </div>
            <div className="about-text">
              <p className="section-subtitle reveal">About Me</p>
              <h2 className="section-title reveal">
                The Eye Behind<br />the <em>Lens</em>
              </h2>
              <div className="section-divider reveal" />
              <p className="reveal">
                Hi, I&apos;m Isabel — a young Italian photographer with a deep passion for capturing
                the beauty in everyday moments. From sun-kissed portraits to atmospheric street scenes,
                my work blends natural light with authentic emotion.
              </p>
              <p className="reveal">
                I believe every photograph should tell a story. Whether it&apos;s a wedding, a creative
                editorial, or the quiet magic of a landscape, I pour my heart into every single frame.
              </p>
              <div className="about-stats reveal">
                <div className="stat-item">
                  <h4>150+</h4>
                  <p>Projects</p>
                </div>
                <div className="stat-item">
                  <h4>3</h4>
                  <p>Years Experience</p>
                </div>
                <div className="stat-item">
                  <h4>50+</h4>
                  <p>Happy Clients</p>
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
              <p className="section-subtitle reveal">Get in Touch</p>
              <h2 className="section-title reveal">
                Let&apos;s Create<br />Something <em>Beautiful</em>
              </h2>
              <div className="section-divider reveal" />
              <p className="reveal">
                Have a project in mind? I&apos;d love to hear from you. Whether it&apos;s a portrait
                session, an event, or a creative collaboration — let&apos;s make it happen.
              </p>
              <div className="contact-details reveal">
                <a href="mailto:hello@isabelfinaldi.com">
                  <span className="icon">✉</span> hello@isabelfinaldi.com
                </a>
                <a href="tel:+393451234567">
                  <span className="icon">☏</span> +39 345 123 4567
                </a>
                <span className="contact-location">
                  <span className="icon">◎</span> Milan, Italy
                </span>
              </div>
              <div className="social-links reveal">
                <a href="#" aria-label="Instagram">IG</a>
                <a href="#" aria-label="TikTok">TK</a>
                <a href="#" aria-label="Pinterest">PT</a>
                <a href="#" aria-label="Behance">BE</a>
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
                <input type="text" placeholder="Your Name" required id="contact-name" />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required id="contact-email" />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" id="contact-subject" />
              </div>
              <div className="form-group">
                <textarea placeholder="Tell me about your project..." required id="contact-message" />
              </div>
              <button type="submit" className="btn-submit" id="contact-submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox.open && (
        <Lightbox
          photo={lightbox.currentPhoto}
          onClose={lightbox.close}
          onPrev={() => lightbox.navigate(-1)}
          onNext={() => lightbox.navigate(1)}
        />
      )}
    </>
  );
}

import { useState, useMemo, useEffect } from "react";
import { PHOTOS, getUniqueValues, formatDate } from "../../data/photos";
import { useLightbox, useVotes } from "../../hooks/usePortfolio";
import { useLang } from "../../context/LanguageContext";
import Lightbox from "../../components/Lightbox/Lightbox";
import "./GalleryPage.css";

const MONTHS_LABEL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GalleryPage() {
  const { t } = useLang();
  const lightbox = useLightbox(PHOTOS);
  const votes = useVotes();

  const [filters, setFilters] = useState({
    category: "",
    shootingName: "",
    photomodel: "",
    date: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("votes");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const categories = useMemo(() => getUniqueValues("category"), []);
  const shootings = useMemo(() => getUniqueValues("shootingName"), []);
  const photomodels = useMemo(() => getUniqueValues("photomodel"), []);
  const dates = useMemo(() => {
    const months = PHOTOS.map((p) => p.date.substring(0, 7));
    return [...new Set(months)].sort().reverse();
  }, []);

  const filtered = useMemo(() => {
    let result = PHOTOS.filter((photo) => {
      if (filters.category && photo.category !== filters.category) return false;
      if (filters.shootingName && photo.shootingName !== filters.shootingName) return false;
      if (filters.photomodel && photo.photomodel !== filters.photomodel) return false;
      if (filters.date && photo.date.substring(0, 7) !== filters.date) return false;
      if (filters.search) {
        const haystack = `${photo.title} ${photo.category} ${photo.shootingName} ${photo.photomodel ?? ""}`.toLowerCase();
        if (!haystack.includes(filters.search.toLowerCase())) return false;
      }
      return true;
    });
    result.sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "date-new") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-old") return new Date(a.date) - new Date(b.date);
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });
    return result;
  }, [filters, sortBy]);

  const activeTags = Object.entries(filters)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => ({
      key: k,
      label: k === "search" ? `"${v}"` : v,
    }));

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters({ category: "", shootingName: "", photomodel: "", date: "", search: "" });
    setSortBy("votes");
  };

  const dateLabel = (val) => {
    const [y, m] = val.split("-");
    return `${MONTHS_LABEL[parseInt(m) - 1]} ${y}`;
  };

  return (
    <>
      {/* HEADER */}
      <section className="gallery-header">
        <div className="container">
          <p className="section-subtitle">{t.gallery.subtitle}</p>
          <h1 className="section-title">{t.gallery.title1} <em>{t.gallery.title2}</em></h1>
          <div className="section-divider" style={{ margin: "0 auto var(--space-lg)" }} />
          <p className="gallery-lead">{t.gallery.lead}</p>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="container">
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="filter-search">{t.gallery.searchLabel}</label>
              <input
                id="filter-search"
                type="text"
                placeholder={t.gallery.searchPlaceholder}
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="filter-category">{t.gallery.categoryLabel}</label>
              <select id="filter-category" value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
                <option value="">{t.gallery.allCategories}</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-shooting">{t.gallery.shootingLabel}</label>
              <select id="filter-shooting" value={filters.shootingName} onChange={(e) => setFilter("shootingName", e.target.value)}>
                <option value="">{t.gallery.allShootings}</option>
                {shootings.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-photomodel">{t.gallery.photomodelLabel}</label>
              <select id="filter-photomodel" value={filters.photomodel} onChange={(e) => setFilter("photomodel", e.target.value)}>
                <option value="">{t.gallery.allModels}</option>
                {photomodels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-date">{t.gallery.dateLabel}</label>
              <select id="filter-date" value={filters.date} onChange={(e) => setFilter("date", e.target.value)}>
                <option value="">{t.gallery.allDates}</option>
                {dates.map((d) => <option key={d} value={d}>{dateLabel(d)}</option>)}
              </select>
            </div>
            <button className="filter-reset" id="filter-reset" onClick={resetFilters}>
              {t.gallery.reset}
            </button>
          </div>

          {activeTags.length > 0 && (
            <div className="active-filters">
              {activeTags.map(({ key, label }) => (
                <span key={key} className="filter-tag">
                  {label}
                  <button onClick={() => setFilter(key, "")} aria-label={`Remove ${key} filter`}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GALLERY */}
      <section className="section gallery-section">
        <div className="container">
          <div className="gallery-info">
            <span className="result-count">{t.gallery.photosFound(filtered.length)}</span>
            <div className="sort-control">
              <label htmlFor="sort-select">{t.gallery.sortLabel}</label>
              <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="votes">{t.gallery.sortVotes}</option>
                <option value="date-new">{t.gallery.sortDateNew}</option>
                <option value="date-old">{t.gallery.sortDateOld}</option>
                <option value="name">{t.gallery.sortName}</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="gallery-empty">
              <h3>{t.gallery.noPhotosTitle}</h3>
              <p>{t.gallery.noPhotosText}</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((photo, index) => {
                const voted = votes.hasVoted(photo.id);
                const count = votes.getCount(photo);
                return (
                  <div
                    key={photo.id}
                    className={`gallery-item${voted ? " gallery-item--voted" : ""}`}
                    onClick={() => lightbox.open(index, filtered)}
                  >
                    <img src={photo.src} alt={photo.title} loading="lazy" />
                    <div className="gallery-item-overlay">
                      <h4 className="gallery-item-title">{photo.title}</h4>
                      <div className="gallery-item-details">
                        <span className="tag">{photo.category}</span>
                        {photo.photomodel && (
                          <span className="tag model-tag">📷 {photo.photomodel}</span>
                        )}
                        <span className="tag">{formatDate(photo.date)}</span>
                      </div>
                    </div>
                    {/* Vote button — always visible, bottom-right corner */}
                    <button
                      className={`vote-btn${voted ? " vote-btn--voted" : ""}`}
                      onClick={(e) => { e.stopPropagation(); votes.vote(photo); }}
                      disabled={voted}
                      title={voted ? t.gallery.voted : t.gallery.vote}
                      aria-label={voted ? t.gallery.voted : t.gallery.vote}
                    >
                      <span className="vote-heart">{voted ? "♥" : "♡"}</span>
                      <span className="vote-count">{count}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

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

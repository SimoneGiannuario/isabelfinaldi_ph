import { useState, useMemo, useEffect, type ChangeEvent } from "react";
import { formatDate } from "../../data/photos";
import { useNhostPhotos } from "../../hooks/useNhostPhotos";
import { useLightbox, useVotes } from "../../hooks/usePortfolio";
import { getSrcSet, getOptimizedUrl } from "../../data/photos";
import { useLang } from "../../context/LanguageContext";
import Lightbox from "../../components/Lightbox/Lightbox";
import SEO from "../../components/SEO/SEO";
import type { Photo } from "../../types/photo";
import "./GalleryPage.css";

const MONTHS_LABEL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Filters {
  category: string;
  shootingName: string;
  photomodel: string;
  date: string;
  search: string;
}

export default function GalleryPage() {
  const { t } = useLang();
  const { allPhotos, loading: photosLoading, error: photosError } = useNhostPhotos();
  const lightbox = useLightbox(allPhotos);
  const votes = useVotes();

  const [filters, setFilters] = useState<Filters>({
    category: "",
    shootingName: "",
    photomodel: "",
    date: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("votes");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const unique = (key: keyof Photo): string[] => {
    const raw = allPhotos.map((p) => p[key]).filter(Boolean);
    // If the value might contain commas (like photomodels), handle both arrays and strings
    const splitVals = raw.flatMap((val) =>
      Array.isArray(val) ? val : String(val).split(',').map((s) => s.trim())
    );
    return [...new Set(splitVals)].sort();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categories = useMemo(() => unique("category"), [allPhotos]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shootings = useMemo(() => unique("shootingName"), [allPhotos]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const photomodels = useMemo(() => unique("photomodel"), [allPhotos]);
  const dates = useMemo(() => {
    const months = allPhotos.map((p) => p.date.substring(0, 7));
    return [...new Set(months)].sort().reverse();
  }, [allPhotos]);

  const filtered = useMemo(() => {
    const result = allPhotos.filter((photo) => {
      if (filters.category && photo.category !== filters.category) return false;
      if (filters.shootingName && photo.shootingName !== filters.shootingName) return false;
      if (filters.photomodel) {
        // photomodel can be an array (Nhost) or a comma-separated string (static data)
        const models = Array.isArray(photo.photomodel)
          ? photo.photomodel
          : (photo.photomodel || "").split(',').map(m => m.trim());
        if (!models.includes(filters.photomodel)) return false;
      }
      if (filters.date && photo.date.substring(0, 7) !== filters.date) return false;
      if (filters.search) {
        const haystack = `${photo.title} ${photo.category} ${photo.shootingName} ${photo.photomodel ?? ""}`.toLowerCase();
        if (!haystack.includes(filters.search.toLowerCase())) return false;
      }
      return true;
    });
    result.sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "date-new") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date-old") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });
    return result;
  }, [filters, sortBy, allPhotos]);

  const activeTags = Object.entries(filters)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => ({
      key: k,
      label: k === "search" ? `"${v}"` : k === "category" ? (t.gallery.categories[v] || v) : v,
    }));

  const setFilter = (key: keyof Filters, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters({ category: "", shootingName: "", photomodel: "", date: "", search: "" });
    setSortBy("votes");
  };

  const dateLabel = (val: string) => {
    const [y, m] = val.split("-");
    return `${MONTHS_LABEL[parseInt(m) - 1]} ${y}`;
  };

  return (
    <>
      <SEO 
        title="Galleria — Isabel Finaldi Photography"
        description="Esplora il portfolio fotografico di Isabel Finaldi. Sfoglia ritratti, paesaggi, matrimoni e progetti creativi."
      />
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
          <button
            className="filter-toggle"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            aria-controls="filter-controls"
          >
            <span>{filtersOpen ? '▲' : '▼'} {t.gallery.filtersLabel || 'Filtri'}</span>
            {activeTags.length > 0 && <span className="filter-badge">{activeTags.length}</span>}
          </button>
          <div className={`filter-controls${filtersOpen ? ' filter-controls--open' : ''}`} id="filter-controls">
            <div className="filter-group">
              <label htmlFor="filter-search">{t.gallery.searchLabel}</label>
              <input
                id="filter-search"
                type="text"
                placeholder={t.gallery.searchPlaceholder}
                value={filters.search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter("search", e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="filter-category">{t.gallery.categoryLabel}</label>
              <select id="filter-category" value={filters.category} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter("category", e.target.value)}>
                <option value="">{t.gallery.allCategories}</option>
                {categories.map((c) => <option key={c} value={c}>{t.gallery.categories[c] || c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-shooting">{t.gallery.shootingLabel}</label>
              <select id="filter-shooting" value={filters.shootingName} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter("shootingName", e.target.value)}>
                <option value="">{t.gallery.allShootings}</option>
                {shootings.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-photomodel">{t.gallery.photomodelLabel}</label>
              <select id="filter-photomodel" value={filters.photomodel} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter("photomodel", e.target.value)}>
                <option value="">{t.gallery.allModels}</option>
                {photomodels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-date">{t.gallery.dateLabel}</label>
              <select id="filter-date" value={filters.date} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilter("date", e.target.value)}>
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
                  <button onClick={() => setFilter(key as keyof Filters, "")} aria-label={`Remove ${key} filter`}>✕</button>
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
            <span className="result-count" role="status" aria-live="polite">{t.gallery.photosFound(filtered.length)}</span>
            <div className="sort-control">
              <label htmlFor="sort-select">{t.gallery.sortLabel}</label>
              <select id="sort-select" value={sortBy} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}>
                <option value="votes">{t.gallery.sortVotes}</option>
                <option value="date-new">{t.gallery.sortDateNew}</option>
                <option value="date-old">{t.gallery.sortDateOld}</option>
                <option value="name">{t.gallery.sortName}</option>
              </select>
            </div>
          </div>

          {photosLoading ? (
            <div className="gallery-empty"><p>Caricamento foto…</p></div>
          ) : photosError ? (
            <div className="gallery-empty"><p style={{ color: "var(--clr-accent)" }}>{photosError}</p></div>
          ) : filtered.length === 0 ? (
            <div className="gallery-empty">
              <h3>{t.gallery.noPhotosTitle}</h3>
              <p>{t.gallery.noPhotosText}</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((photo, index) => {
                const voted = votes.hasVoted(photo.id);
                const count = votes.getCount(photo);

                const srcSet = getSrcSet(photo.src);

                const base = getOptimizedUrl(photo.src, 960);
                return (
                  <div
                    key={photo.id}
                    className={`gallery-item${voted ? " gallery-item--voted" : ""}`}
                    onClick={() => lightbox.open(index, filtered)}
                  >
                    <img
                      src={base}
                      srcSet={srcSet}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={photo.title} loading="lazy" />
                    <div className="gallery-item-overlay">
                      <h4 className="gallery-item-title">{photo.title}</h4>
                      <div className="gallery-item-details">
                        <span className="tag">{t.gallery.categories[photo.category] || photo.category}</span>
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

      {lightbox.isOpen && (
        <Lightbox
          photo={lightbox.currentPhoto}
          onClose={lightbox.close}
          onPrev={() => lightbox.navigate(-1)}
          onNext={() => lightbox.navigate(1)}
          currentIndex={lightbox.index + 1}
          totalPhotos={filtered.length}
        />
      )}
    </>
  );
}

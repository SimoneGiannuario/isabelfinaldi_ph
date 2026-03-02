import { useState, useMemo, useEffect } from "react";
import { PHOTOS, getUniqueValues, formatDate } from "../../data/photos";
import { useLightbox } from "../../hooks/usePortfolio";
import Lightbox from "../../components/Lightbox/Lightbox";
import "./GalleryPage.css";

const MONTHS_LABEL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GalleryPage() {
  const lightbox = useLightbox(PHOTOS);

  // Filter state
  const [filters, setFilters] = useState({
    category: "",
    shootingName: "",
    photomodel: "",
    date: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("votes");

  // Reset scroll on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Unique values for dropdowns
  const categories = useMemo(() => getUniqueValues("category"), []);
  const shootings = useMemo(() => getUniqueValues("shootingName"), []);
  const photomodels = useMemo(() => getUniqueValues("photomodel"), []);
  const dates = useMemo(() => {
    const months = PHOTOS.map((p) => p.date.substring(0, 7));
    return [...new Set(months)].sort().reverse();
  }, []);

  // Filtered + sorted results
  const filtered = useMemo(() => {
    let result = PHOTOS.filter((photo) => {
      if (filters.category && photo.category !== filters.category) return false;
      if (filters.shootingName && photo.shootingName !== filters.shootingName) return false;
      if (filters.photomodel && photo.photomodel !== filters.photomodel) return false;
      if (filters.date) {
        if (photo.date.substring(0, 7) !== filters.date) return false;
      }
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

  // Active filter tags
  const activeTags = Object.entries(filters)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => ({
      key: k,
      label: k === "search" ? `"${v}"` : v,
    }));

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

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
          <p className="section-subtitle">Full Collection</p>
          <h1 className="section-title">All <em>Work</em></h1>
          <div className="section-divider" style={{ margin: "0 auto var(--space-lg)" }} />
          <p className="gallery-lead">
            Explore the complete portfolio. Use the filters to browse by category,
            shooting, photomodel, or date.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="container">
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="filter-search">Search</label>
              <input
                id="filter-search"
                type="text"
                placeholder="Search photos..."
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="filter-category">Category</label>
              <select id="filter-category" value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-shooting">Shooting</label>
              <select id="filter-shooting" value={filters.shootingName} onChange={(e) => setFilter("shootingName", e.target.value)}>
                <option value="">All Shootings</option>
                {shootings.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-photomodel">Photomodel</label>
              <select id="filter-photomodel" value={filters.photomodel} onChange={(e) => setFilter("photomodel", e.target.value)}>
                <option value="">All Models</option>
                {photomodels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="filter-date">Date</label>
              <select id="filter-date" value={filters.date} onChange={(e) => setFilter("date", e.target.value)}>
                <option value="">All Dates</option>
                {dates.map((d) => <option key={d} value={d}>{dateLabel(d)}</option>)}
              </select>
            </div>
            <button className="filter-reset" id="filter-reset" onClick={resetFilters}>
              Reset
            </button>
          </div>

          {/* Active filter tags */}
          {activeTags.length > 0 && (
            <div className="active-filters">
              {activeTags.map(({ key, label }) => (
                <span key={key} className="filter-tag">
                  {label}
                  <button onClick={() => setFilter(key, ")} aria-label={`Remove ${key} filter`}>✕</button>
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
            <span className="result-count">
              {filtered.length} photo{filtered.length !== 1 ? "s" : ""} found
            </span>
            <div className="sort-control">
              <label htmlFor="sort-select">Sort by:</label>
              <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="votes">Most Popular</option>
                <option value="date-new">Newest First</option>
                <option value="date-old">Oldest First</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="gallery-empty">
              <h3>No photos found</h3>
              <p>Try adjusting your filters to discover more work.</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((photo, index) => (
                <div
                  key={photo.id}
                  className="gallery-item"
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
                </div>
              ))}
            </div>
          )}
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

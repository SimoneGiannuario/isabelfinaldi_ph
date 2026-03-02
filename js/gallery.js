// ============================================================
// Gallery Page — Filtering, Sorting, Masonry Grid
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initGalleryFilters();
});

function initGalleryFilters() {
  const grid = document.getElementById("gallery-grid");
  const resultCount = document.getElementById("result-count");
  if (!grid) return;

  const lightbox = initLightbox(PHOTOS);

  // Populate filter dropdowns
  populateFilter("filter-category", getUniqueValues("category"));
  populateFilter("filter-shooting", getUniqueValues("shootingName"));
  populateFilter("filter-photomodel", getUniqueValues("photomodel"));
  populateDateFilter();

  // Filter state
  let filters = {
    category: "",
    shootingName: "",
    photomodel: "",
    date: "",
    search: ""
  };

  let sortBy = "votes"; // default sort

  // Event listeners
  document.getElementById("filter-category").addEventListener("change", (e) => {
    filters.category = e.target.value;
    applyFilters();
  });

  document.getElementById("filter-shooting").addEventListener("change", (e) => {
    filters.shootingName = e.target.value;
    applyFilters();
  });

  document.getElementById("filter-photomodel").addEventListener("change", (e) => {
    filters.photomodel = e.target.value;
    applyFilters();
  });

  document.getElementById("filter-date").addEventListener("change", (e) => {
    filters.date = e.target.value;
    applyFilters();
  });

  const searchInput = document.getElementById("filter-search");
  if (searchInput) {
    searchInput.addEventListener("input", debounce((e) => {
      filters.search = e.target.value.toLowerCase();
      applyFilters();
    }, 300));
  }

  document.getElementById("sort-select").addEventListener("change", (e) => {
    sortBy = e.target.value;
    applyFilters();
  });

  document.getElementById("filter-reset").addEventListener("click", () => {
    filters = { category: "", shootingName: "", photomodel: "", date: "", search: "" };
    document.getElementById("filter-category").value = "";
    document.getElementById("filter-shooting").value = "";
    document.getElementById("filter-photomodel").value = "";
    document.getElementById("filter-date").value = "";
    if (searchInput) searchInput.value = "";
    document.getElementById("sort-select").value = "votes";
    sortBy = "votes";
    applyFilters();
  });

  function applyFilters() {
    let filtered = PHOTOS.filter(photo => {
      if (filters.category && photo.category !== filters.category) return false;
      if (filters.shootingName && photo.shootingName !== filters.shootingName) return false;
      if (filters.photomodel && photo.photomodel !== filters.photomodel) return false;
      if (filters.date) {
        const photoMonth = photo.date.substring(0, 7); // "YYYY-MM"
        if (photoMonth !== filters.date) return false;
      }
      if (filters.search) {
        const searchStr = `${photo.title} ${photo.category} ${photo.shootingName} ${photo.photomodel || ""}`.toLowerCase();
        if (!searchStr.includes(filters.search)) return false;
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "votes": return b.votes - a.votes;
        case "date-new": return new Date(b.date) - new Date(a.date);
        case "date-old": return new Date(a.date) - new Date(b.date);
        case "name": return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    renderGallery(filtered);
    renderActiveFilters(filters);
    resultCount.textContent = `${filtered.length} photo${filtered.length !== 1 ? "s" : ""} found`;
  }

  function renderGallery(photos) {
    grid.innerHTML = "";

    if (photos.length === 0) {
      grid.innerHTML = `
        <div class="gallery-empty">
          <h3>No photos found</h3>
          <p>Try adjusting your filters to discover more work.</p>
        </div>
      `;
      return;
    }

    photos.forEach((photo, index) => {
      const item = document.createElement("div");
      item.className = "gallery-item";

      const detailTags = [`<span class="tag">${photo.category}</span>`];
      if (photo.photomodel) {
        detailTags.push(`<span class="tag model-tag">📷 ${photo.photomodel}</span>`);
      }
      detailTags.push(`<span class="tag">${formatDate(photo.date)}</span>`);

      item.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        <div class="gallery-item-overlay">
          <h4 class="gallery-item-title">${photo.title}</h4>
          <div class="gallery-item-details">
            ${detailTags.join("")}
          </div>
        </div>
      `;

      item.addEventListener("click", () => lightbox.openLightbox(index, photos));
      grid.appendChild(item);
    });
  }

  function renderActiveFilters(f) {
    const container = document.getElementById("active-filters");
    if (!container) return;
    container.innerHTML = "";

    const activeFilters = [];
    if (f.category) activeFilters.push({ key: "category", label: f.category });
    if (f.shootingName) activeFilters.push({ key: "shootingName", label: f.shootingName });
    if (f.photomodel) activeFilters.push({ key: "photomodel", label: f.photomodel });
    if (f.date) activeFilters.push({ key: "date", label: f.date });
    if (f.search) activeFilters.push({ key: "search", label: `"${f.search}"` });

    activeFilters.forEach(({ key, label }) => {
      const tag = document.createElement("span");
      tag.className = "filter-tag";
      tag.innerHTML = `${label} <button data-key="${key}">✕</button>`;
      tag.querySelector("button").addEventListener("click", () => {
        filters[key] = "";
        const el = document.getElementById(`filter-${key === "shootingName" ? "shooting" : key}`);
        if (el) el.value = "";
        if (key === "search" && searchInput) searchInput.value = "";
        applyFilters();
      });
      container.appendChild(tag);
    });
  }

  // Initial render
  applyFilters();
}

// ---------- Helpers ----------
function populateFilter(id, values) {
  const select = document.getElementById(id);
  if (!select) return;
  values.forEach(val => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function populateDateFilter() {
  const select = document.getElementById("filter-date");
  if (!select) return;
  const months = PHOTOS.map(p => p.date.substring(0, 7));
  const unique = [...new Set(months)].sort().reverse();
  unique.forEach(val => {
    const option = document.createElement("option");
    option.value = val;
    const [y, m] = val.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    option.textContent = `${monthNames[parseInt(m) - 1]} ${y}`;
    select.appendChild(option);
  });
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ============================================================
// Homepage — Featured Photos Grid
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedPhotos();
});

function renderFeaturedPhotos() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  const featured = getFeaturedPhotos();
  const lightbox = initLightbox(featured);

  featured.forEach((photo, index) => {
    const card = document.createElement("div");
    card.className = `photo-card reveal reveal-delay-${(index % 4) + 1}`;
    if (index === 0) card.classList.add("tall");

    card.innerHTML = `
      <img src="${photo.src}" alt="${photo.title}" loading="lazy">
      <div class="photo-card-overlay">
        <h3 class="photo-card-title">${photo.title}</h3>
        <div class="photo-card-meta">
          <span>${photo.category}</span>
          <span>${photo.shootingName}</span>
          <span class="votes">♥ ${photo.votes}</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => lightbox.openLightbox(index, featured));
    grid.appendChild(card);
  });

  // Re-init scroll reveal for dynamically added elements
  initScrollReveal();
}

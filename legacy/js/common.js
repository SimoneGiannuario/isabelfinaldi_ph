// ============================================================
// Common JS — Navbar, Lightbox, Scroll Reveals
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollReveal();
  initMobileMenu();
});

// ---------- Navbar scroll behavior ----------
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// ---------- Mobile Menu ----------
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

// ---------- Scroll Reveal ----------
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  reveals.forEach(el => observer.observe(el));
}

// ---------- Lightbox ----------
function initLightbox(photos) {
  let currentIndex = 0;
  let currentPhotos = photos;

  // Create lightbox DOM
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.id = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" id="lightbox-close" aria-label="Close">✕</button>
    <button class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Previous">‹</button>
    <div class="lightbox-content">
      <img id="lightbox-img" src="" alt="">
    </div>
    <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Next">›</button>
    <div class="lightbox-info">
      <h3 id="lightbox-title"></h3>
      <p id="lightbox-meta"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbMeta = document.getElementById("lightbox-meta");

  function openLightbox(index, filteredPhotos) {
    if (filteredPhotos) currentPhotos = filteredPhotos;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const photo = currentPhotos[currentIndex];
    if (!photo) return;
    lbImg.src = photo.src;
    lbImg.alt = photo.title;
    lbTitle.textContent = photo.title;
    const metaParts = [photo.category, photo.shootingName];
    if (photo.photomodel) metaParts.push(photo.photomodel);
    metaParts.push(formatDate(photo.date));
    lbMeta.textContent = metaParts.join(" · ");
  }

  function navigate(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = currentPhotos.length - 1;
    if (currentIndex >= currentPhotos.length) currentIndex = 0;
    updateLightbox();
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => navigate(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => navigate(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  return { openLightbox, closeLightbox };
}

// ---------- Utility ----------
function formatDate(dateStr) {
  const months = [
    "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
    "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

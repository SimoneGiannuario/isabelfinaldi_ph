// Photo data — edit this to add/update/remove photos
export const CATEGORIES = ["Portrait", "Landscape", "Street", "Events", "Creative"];

export const PHOTOS = [
  {
    id: 1,
    src: "images/portrait_golden_hour.png",
    title: "Luce Dorata",
    category: "Portrait",
    shootingName: "Golden Hour Session",
    photomodel: "Giulia Marchetti",
    date: "2025-09-14",
    featured: true,
    votes: 128,
  },
  {
    id: 2,
    src: "images/portrait_studio_bw.png",
    title: "Ombre & Luce",
    category: "Portrait",
    shootingName: "Studio Noir",
    photomodel: "Marco Bellini",
    date: "2025-11-02",
    featured: true,
    votes: 97,
  },
  {
    id: 3,
    src: "images/landscape_sunset.png",
    title: "Tramonto Toscano",
    category: "Landscape",
    shootingName: "Tuscan Hills",
    photomodel: null,
    date: "2025-06-20",
    featured: true,
    votes: 145,
  },
  {
    id: 4,
    src: "images/street_night.png",
    title: "Riflessi Urbani",
    category: "Street",
    shootingName: "Urban Vibes",
    photomodel: null,
    date: "2025-08-05",
    featured: true,
    votes: 112,
  },
  {
    id: 5,
    src: "images/event_wedding.png",
    title: "Promesse nel Giardino",
    category: "Events",
    shootingName: "Villa Rossi Wedding",
    photomodel: null,
    date: "2025-07-12",
    featured: true,
    votes: 156,
  },
  {
    id: 6,
    src: "images/portrait_golden_hour.png",
    title: "Sogni al Tramonto",
    category: "Creative",
    shootingName: "Golden Hour Session",
    photomodel: "Giulia Marchetti",
    date: "2025-09-14",
    featured: false,
    votes: 64,
  },
  {
    id: 7,
    src: "images/portrait_studio_bw.png",
    title: "Profilo nel Buio",
    category: "Portrait",
    shootingName: "Studio Noir",
    photomodel: "Marco Bellini",
    date: "2025-11-02",
    featured: false,
    votes: 81,
  },
  {
    id: 8,
    src: "images/landscape_sunset.png",
    title: "Colline Infinite",
    category: "Landscape",
    shootingName: "Tuscan Hills",
    photomodel: null,
    date: "2025-06-20",
    featured: false,
    votes: 73,
  },
  {
    id: 9,
    src: "images/street_night.png",
    title: "Luci della Città",
    category: "Street",
    shootingName: "Notte Romana",
    photomodel: null,
    date: "2026-01-10",
    featured: false,
    votes: 55,
  },
  {
    id: 10,
    src: "images/event_wedding.png",
    title: "Il Primo Ballo",
    category: "Events",
    shootingName: "Villa Rossi Wedding",
    photomodel: null,
    date: "2025-07-12",
    featured: false,
    votes: 89,
  },
  {
    id: 11,
    src: "images/portrait_golden_hour.png",
    title: "Vento d'Estate",
    category: "Creative",
    shootingName: "Summer Breeze",
    photomodel: "Sofia Ricci",
    date: "2026-02-05",
    featured: true,
    votes: 134,
  },
  {
    id: 12,
    src: "images/portrait_studio_bw.png",
    title: "Silenzio",
    category: "Portrait",
    shootingName: "Minimal Portraits",
    photomodel: "Elena Conti",
    date: "2025-12-18",
    featured: false,
    votes: 42,
  },
];

export function getFeaturedPhotos() {
  return getAllPhotos().filter((p) => p.featured).sort((a, b) => b.votes - a.votes);
}

export function getUniqueValues(key) {
  const values = getAllPhotos().map((p) => p[key]).filter((v) => v !== null && v !== undefined);
  return [...new Set(values)].sort();
}

export function formatDate(dateStr) {
  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Custom photo persistence (localStorage) ───────────────────────────────────
const LS_CUSTOM = "isf_custom_photos";

export function getCustomPhotos() {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM)) ?? []; }
  catch { return []; }
}

// ── Static photo metadata overrides (localStorage) ───────────────────────────
// Keyed by photo id so only changed fields are stored.
const LS_STATIC_OVERRIDES = "isf_static_overrides";

export function getStaticOverrides() {
  try { return JSON.parse(localStorage.getItem(LS_STATIC_OVERRIDES)) ?? {}; }
  catch { return {}; }
}

export function updateStaticOverride(id, updates) {
  const all = getStaticOverrides();
  all[id] = { ...(all[id] ?? {}), ...updates };
  localStorage.setItem(LS_STATIC_OVERRIDES, JSON.stringify(all));
}

export function resetStaticOverride(id) {
  const all = getStaticOverrides();
  delete all[id];
  localStorage.setItem(LS_STATIC_OVERRIDES, JSON.stringify(all));
}

// ── Merged photo list ─────────────────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL;

function withBase(photo) {
  if (!photo.src || photo.src.startsWith("data:") || photo.src.startsWith(BASE)) return photo;
  return { ...photo, src: `${BASE}${photo.src}` };
}

export function getAllPhotos() {
  const overrides = getStaticOverrides();
  const staticWithOverrides = PHOTOS.map((p) =>
    overrides[p.id] ? { ...p, ...overrides[p.id] } : p
  );
  return [...staticWithOverrides, ...getCustomPhotos()].map(withBase);
}

export function saveCustomPhoto(photo) {
  const existing = getCustomPhotos();
  const newPhoto = { ...photo, id: `custom_${Date.now()}`, custom: true };
  localStorage.setItem(LS_CUSTOM, JSON.stringify([...existing, newPhoto]));
  return newPhoto;
}

export function updateCustomPhoto(id, updates) {
  const updated = getCustomPhotos().map((p) => p.id === id ? { ...p, ...updates } : p);
  localStorage.setItem(LS_CUSTOM, JSON.stringify(updated));
}

export function deleteCustomPhoto(id) {
  const filtered = getCustomPhotos().filter((p) => p.id !== id);
  localStorage.setItem(LS_CUSTOM, JSON.stringify(filtered));
}


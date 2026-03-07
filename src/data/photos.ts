// Photo data — edit this to add/update/remove photos
import type { Photo } from "../types/photo";

export const CATEGORIES: string[] = ["Portrait", "Landscape", "Street", "Events", "Creative"];

export const PHOTOS: Photo[] = [
  {
    id: 1,
    src: "images/portrait_golden_hour.webp",
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
    src: "images/portrait_studio_bw.webp",
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
    src: "images/landscape_sunset.webp",
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
    src: "images/street_night.webp",
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
    src: "images/event_wedding.webp",
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
    src: "images/portrait_golden_hour.webp",
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
    src: "images/portrait_studio_bw.webp",
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
    src: "images/landscape_sunset.webp",
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
    src: "images/street_night.webp",
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
    src: "images/event_wedding.webp",
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
    src: "images/portrait_golden_hour.webp",
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
    src: "images/portrait_studio_bw.webp",
    title: "Silenzio",
    category: "Portrait",
    shootingName: "Minimal Portraits",
    photomodel: "Elena Conti",
    date: "2025-12-18",
    featured: false,
    votes: 42,
  },
];

export function getFeaturedPhotos(): Photo[] {
  return getAllPhotos().filter((p) => p.featured).sort((a, b) => b.votes - a.votes);
}

export function getUniqueValues(key: keyof Photo): (string | number | boolean)[] {
  const values = getAllPhotos().map((p) => p[key]).filter((v) => v !== null && v !== undefined);
  return [...new Set(values as (string | number | boolean)[])].sort() as (string | number | boolean)[];
}

export function formatDate(dateStr: string): string {
  const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Custom photo persistence (localStorage) ───────────────────────────────────
const LS_CUSTOM = "isf_custom_photos";

export function getCustomPhotos(): Photo[] {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM) ?? "[]") as Photo[]; }
  catch { return []; }
}

// ── Static photo metadata overrides (localStorage) ───────────────────────────
// Keyed by photo id so only changed fields are stored.
const LS_STATIC_OVERRIDES = "isf_static_overrides";

export function getStaticOverrides(): Record<string | number, Partial<Photo>> {
  try { return JSON.parse(localStorage.getItem(LS_STATIC_OVERRIDES) ?? "{}") as Record<string | number, Partial<Photo>>; }
  catch { return {}; }
}

export function updateStaticOverride(id: number | string, updates: Partial<Photo>): void {
  const all = getStaticOverrides();
  all[id] = { ...(all[id] ?? {}), ...updates };
  localStorage.setItem(LS_STATIC_OVERRIDES, JSON.stringify(all));
}

export function resetStaticOverride(id: number | string): void {
  const all = getStaticOverrides();
  delete all[id];
  localStorage.setItem(LS_STATIC_OVERRIDES, JSON.stringify(all));
}

// ── Merged photo list ─────────────────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL as string;

function withBase(photo: Photo): Photo {
  if (!photo.src || photo.src.startsWith("data:") || photo.src.startsWith(BASE)) return photo;
  return { ...photo, src: `${BASE}${photo.src}` };
}

export function getAllPhotos(): Photo[] {
  const overrides = getStaticOverrides();
  const staticWithOverrides = PHOTOS.map((p) =>
    overrides[p.id] ? { ...p, ...overrides[p.id] } : p
  );
  return [...staticWithOverrides, ...getCustomPhotos()].map(withBase);
}

export function saveCustomPhoto(photo: Omit<Photo, "id" | "custom">): Photo {
  const existing = getCustomPhotos();
  const newPhoto: Photo = { ...photo, id: `custom_${Date.now()}`, custom: true };
  localStorage.setItem(LS_CUSTOM, JSON.stringify([...existing, newPhoto]));
  return newPhoto;
}

export function updateCustomPhoto(id: string | number, updates: Partial<Photo>): void {
  const updated = getCustomPhotos().map((p) => p.id === id ? { ...p, ...updates } : p);
  localStorage.setItem(LS_CUSTOM, JSON.stringify(updated));
}

export function deleteCustomPhoto(id: string | number): void {
  const filtered = getCustomPhotos().filter((p) => p.id !== id);
  localStorage.setItem(LS_CUSTOM, JSON.stringify(filtered));
}

export function getOptimizedUrl(src: string, width?: number): string {
  if (!src || src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http')) return src || '';

  const imgDomain = import.meta.env.VITE_IMAGE_DOMAIN;
  const apiUrl = import.meta.env.VITE_CLOUDFLARE_API_URL;

  // If the src is a relative path (e.g. from Nhost/Cloudflare DB like `images/uuid`), 
  // ensure it is prefixed with the Cloudflare Worker URL so it doesn't 404 on the React host.
  let fullSrc = src;
  if (!src.startsWith('http')) {
    const cleanApiUrl = apiUrl ? apiUrl.replace(/\/$/, '') : '';
    const cleanSrc = src.startsWith('/') ? src : `/${src}`;
    fullSrc = `${cleanApiUrl}${cleanSrc}`;
  }

  // If no Custom Domain with Image Resizing is configured, immediately fallback to the raw un-resized image!
  if (!imgDomain) return fullSrc;

  let path = fullSrc;
  try {
    const url = new URL(fullSrc);
    path = url.pathname;
  } catch {
    if (!path.startsWith('/')) path = '/' + path;
  }

  const params = [];
  if (width) params.push(`width=${width}`);
  params.push('format=webp');

  const base = imgDomain.replace(/\/$/, '');

  // If pulling from another domain, cloudflare usually prefers the absolute URL of the source image.
  const sourceUrl = fullSrc.startsWith('http') ? fullSrc : `${window.location.origin}${path}`;

  return `${base}/cdn-cgi/image/${params.join(',')}/${sourceUrl}`;
}

export function getSrcSet(src: string): string | undefined {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return undefined;

  // Do not generate a srcset if we aren't using a resizing service, preventing unnecessary 404s.
  if (!import.meta.env.VITE_IMAGE_DOMAIN) return undefined;

  const widths = [400, 800, 1200, 1600];
  return widths.map(w => `${getOptimizedUrl(src, w)} ${w}w`).join(', ');
}

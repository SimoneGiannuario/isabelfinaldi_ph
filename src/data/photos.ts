// Photo data — edit this to add/update/remove photos
import type { Photo } from "../types/photo";

export const CATEGORIES: string[] = ["Ritratto", "Paesaggio", "Street", "Eventi", "Creativo"];

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
  return [...getCustomPhotos()].map(withBase);
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
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return src || '';

  const apiUrl = import.meta.env.VITE_CLOUDFLARE_API_URL;
  const imgDomain = import.meta.env.VITE_IMAGE_DOMAIN;

  // We should ONLY resize images that come from the backend Worker API.
  // Static assets from the frontend (public folder, etc) should just be returned as-is
  // so we don't try to resize them using Cloudflare (unless they are hosted on a CF domain, but let's be safe).

  // If it's an absolute URL, check if it belongs to our worker
  if (src.startsWith('http')) {
    if (apiUrl && !src.startsWith(apiUrl)) {
      return src;
    }
  }

  // If the src is a relative path (e.g. from Nhost/Cloudflare DB like `images/uuid`), 
  // ensure it is prefixed with the Cloudflare Worker URL so it doesn't 404 on the React host.
  let fullSrc = src;
  if (!src.startsWith('http')) {
    const cleanApiUrl = apiUrl ? apiUrl.replace(/\/$/, '') : '';
    const cleanSrc = src.startsWith('/') ? src : `/${src}`;
    fullSrc = `${cleanApiUrl}${cleanSrc}`;
  }

  // Cloudflare strictly disables Image Resizing (/cdn-cgi/image) on .workers.dev URLs.
  // If the user hasn't explicitly set a VITE_IMAGE_DOMAIN (Custom Domain mapped to Cloudflare),
  // fallback to providing the uncompressed raw image directly from the Worker!
  if (!imgDomain) return fullSrc;

  let path = fullSrc;
  try {
    const url = new URL(fullSrc);
    path = url.pathname;

    // Make sure we substitute the old .workers.dev domain with the current environment API url 
    // Otherwise Cloudflare blocks the cross-domain request 
    if (apiUrl && url.origin !== new URL(apiUrl).origin) {
      fullSrc = `${apiUrl.replace(/\/$/, '')}${path}`;
    }
  } catch {
    if (!path.startsWith('/')) path = '/' + path;
  }

  const params = [];
  if (width) params.push(`width=${width}`);
  params.push(`quality=85`);
  params.push('format=auto');

  const base = imgDomain.replace(/\/$/, '');

  return `${base}/cdn-cgi/image/${params.join(',')}/${fullSrc.replace(/^https?:\/\//, 'https://')}`;
}

export function getSrcSet(src: string): string | undefined {
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) return undefined;

  const apiUrl = import.meta.env.VITE_CLOUDFLARE_API_URL;

  // Skip srcset if it's an absolute URL NOT belonging to our Cloudflare Worker 
  // (e.g., local/public folder static assets)
  if (src.startsWith('http')) {
    if (apiUrl && !src.startsWith(apiUrl)) {
      return undefined;
    }
  }

  // Do not generate a srcset if we aren't using a resizing service, preventing unnecessary 404s.
  if (!import.meta.env.VITE_IMAGE_DOMAIN) return undefined;

  const widths = [400, 600, 650, 700, 800, 1000, 1200, 1440, 1600];
  return widths.map(w => `${getOptimizedUrl(src, w)} ${w}w`).join(', ');
}

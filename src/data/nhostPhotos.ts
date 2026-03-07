
import type { Photo } from '../types/photo';

// The base URL for the Cloudflare API
// Adjust this logic: for local development use the local worker port (e.g., 8787)
// For production, use the actual deployed worker URL.
const API_URL = import.meta.env.VITE_CLOUDFLARE_API_URL || 'http://localhost:8787';

// ── Helper to get admin headers ──────────────────────────────────────────────
const getHeaders = () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ── Public: fetch all uploaded photos ────────────────────────────────────────

interface NhostPhotoRow {
  id: string;
  title: string;
  category: string;
  shooting_name: string;
  photomodel: string | string[] | null;
  date: string;
  featured: boolean;
  votes: number;
  storage_id: string;
  src: string;
}

export async function fetchNhostPhotos(): Promise<Photo[]> {
  try {
    const res = await fetch(`${API_URL}/photos`);
    if (!res.ok) throw new Error('Failed to fetch photos');

    const json = await res.json();
    const photos = (json.data?.photos ?? []) as NhostPhotoRow[];

    return photos.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      shootingName: p.shooting_name,
      photomodel: Array.isArray(p.photomodel) ? p.photomodel : (p.photomodel ? p.photomodel.replace(/^\{|\}$/g, '').split(',').map(m => m.trim()) : []),
      date: p.date,
      featured: p.featured,
      votes: p.votes,
      storageId: p.storage_id,
      src: p.src,
      fromNhost: true, // Keeping this flag name for compatibility with existing components
    }));
  } catch (error) {
    console.error("Error fetching photos from Cloudflare:", error);
    return [];
  }
}

// ── Admin: upload image to Storage + insert row ───────────────────────────────

export interface PhotoUploadMeta {
  title: string;
  category: string;
  shootingName?: string;
  photomodel?: string;
  date: string;
  featured?: boolean;
  votes?: number;
}

export async function uploadPhoto(file: File, meta: PhotoUploadMeta): Promise<string | undefined> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', meta.title);
    formData.append('category', meta.category);
    if (meta.shootingName) formData.append('shootingName', meta.shootingName);
    if (meta.photomodel) formData.append('photomodel', meta.photomodel);
    formData.append('date', meta.date);
    if (meta.featured !== undefined) formData.append('featured', meta.featured.toString());
    if (meta.votes !== undefined) formData.append('votes', meta.votes.toString());

    const headers = getHeaders();
    delete headers['Content-Type']; // Let browser set multipart/form-data with boundary

    const res = await fetch(`${API_URL}/admin/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload photo');
    }

    const json = await res.json();
    return json.data?.id;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error((error as Error).message ?? 'Upload failed');
  }
}

// ── Admin: update metadata only ───────────────────────────────────────────────

export async function updateNhostPhoto(id: string, meta: PhotoUploadMeta): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/admin/photos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(meta),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update photo metadata');
    }
  } catch (error) {
    console.error("Update error:", error);
    throw new Error((error as Error).message ?? 'Update failed');
  }
}

// ── Admin: delete file + row ──────────────────────────────────────────────────

export async function deleteNhostPhoto(id: string): Promise<void> {
  try {
    // We pass storageId just in case, but our Worker infers it from the DB using the id if we want it to.
    const res = await fetch(`${API_URL}/admin/photos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete photo');
    }
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error((error as Error).message ?? 'Delete failed');
  }
}

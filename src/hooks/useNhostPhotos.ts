import { useState, useEffect, useCallback } from 'react';
import { fetchNhostPhotos } from '../data/nhostPhotos';
import type { Photo } from '../types/photo';

const preloadedUrls = new Set<string>();

/**
 * useNhostPhotos
 * Fetches photos stored in Nhost (Hasura + Storage) and merges
 * them with the hardcoded static PHOTOS array.
 *
 * Returns:
 *   nhostPhotos  — only the Nhost-uploaded ones
 *   allPhotos    — static PHOTOS + nhostPhotos merged
 *   loading      — true while fetching
 *   error        — fetch error string or null
 *   refresh()    — re-fetch from Nhost
 */
export function useNhostPhotos() {
  const [nhostPhotos, setNhostPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const photos = await fetchNhostPhotos();
      setNhostPhotos(photos);

      // Preload the photos
      photos.forEach(photo => {
        if (!preloadedUrls.has(photo.src)) {
          preloadedUrls.add(photo.src);
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = photo.src;
          document.head.appendChild(link);
        }
      });
    } catch (err) {
      console.error('useNhostPhotos:', err);
      setError((err as Error).message ?? 'Errore nel caricamento delle foto.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const allPhotos: Photo[] = [/* ...PHOTOS,  */...nhostPhotos];

  return { nhostPhotos, allPhotos, loading, error, refresh: load };
}

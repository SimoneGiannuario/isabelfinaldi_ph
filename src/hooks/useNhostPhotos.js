import { useState, useEffect, useCallback } from 'react';
import { PHOTOS } from '../data/photos';
import { fetchNhostPhotos } from '../data/nhostPhotos';

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
  const [nhostPhotos, setNhostPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const photos = await fetchNhostPhotos();
      setNhostPhotos(photos);
    } catch (err) {
      console.error('useNhostPhotos:', err);
      setError(err.message ?? 'Errore nel caricamento delle foto.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const allPhotos = [...PHOTOS, ...nhostPhotos];

  return { nhostPhotos, allPhotos, loading, error, refresh: load };
}

import { useState, useMemo } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useLang } from "../../context/LanguageContext";
import { formatDate } from "../../data/photos";
import { useNhostPhotos } from "../../hooks/useNhostPhotos";
import { uploadPhoto, updateNhostPhoto, deleteNhostPhoto } from "../../data/nhostPhotos";
import type { PhotoUploadMeta } from "../../data/nhostPhotos";
import type { Photo } from "../../types/photo";
import PhotoUploadForm from "./PhotoUploadForm";

interface UploadItem extends PhotoUploadMeta {
  file: File;
}

export default function AdminDashboard() {
  const { logout } = useAdminAuth();
  const { t } = useLang();
  const catLabel = (c: string) => t.gallery.categories[c] || c;
  const { nhostPhotos, loading, error: fetchError, refresh } = useNhostPhotos();
  const [showUpload, setShowUpload] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Photo | null>(null);
  const [deleteBulkConfirm, setDeleteBulkConfirm] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<boolean | string>(false);
  const [saveError, setSaveError] = useState("");
  const [verticalPhotos, setVerticalPhotos] = useState<Set<string | number>>(new Set());
  const [filters, setFilters] = useState({ category: "", photomodel: "", search: "" });

  const handleImageLoad = (id: string | number, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.naturalHeight > target.naturalWidth) {
      setVerticalPhotos(prev => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
  };

  const handleSave = async (formDataOrArray: PhotoUploadMeta | UploadItem[]) => {
    setSaveError("");

    try {
      if (editingPhoto?.fromNhost) {
        // Edit existing Nhost photo (metadata only) - always single object
        setSaving("Salvataggio in corso...");
        await updateNhostPhoto(editingPhoto.id as string, formDataOrArray as PhotoUploadMeta);
      } else {
        // New upload - can be an array of objects
        const items = Array.isArray(formDataOrArray) ? formDataOrArray : [formDataOrArray as UploadItem];

        for (let i = 0; i < items.length; i++) {
          if (items.length > 1) {
            setSaving(`Caricamento ${i + 1} di ${items.length}...`);
          } else {
            setSaving(true); // default spinner for single
          }
          await uploadPhoto(items[i].file, items[i]);
        }
      }

      setSaving("Aggiornamento galleria...");
      await refresh();
      setShowUpload(false);
      setEditingPhoto(null);
    } catch (err) {
      console.error("Save error:", err);
      setSaveError((err as Error).message ?? "Errore nel salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    setSaving(true);
    try {
      if (selectedPhotoIds.has(photo.id as string)) {
        const newSet = new Set(selectedPhotoIds);
        newSet.delete(photo.id as string);
        setSelectedPhotoIds(newSet);
      }
      await deleteNhostPhoto(photo.id as string);
      await refresh();
    } catch (err) {
      setSaveError((err as Error).message ?? "Errore nella cancellazione.");
    } finally {
      setSaving(false);
      setDeleteConfirm(null);
    }
  };

  const handleBulkDelete = async () => {
    setSaving(true);
    try {
      for (const id of selectedPhotoIds) {
        await deleteNhostPhoto(id);
      }
      setSelectedPhotoIds(new Set());
      await refresh();
    } catch (err) {
      setSaveError((err as Error).message ?? "Errore nella cancellazione multipla.");
    } finally {
      setSaving(false);
      setDeleteBulkConfirm(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedPhotoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedPhotoIds.size === filteredPhotos.length) {
      setSelectedPhotoIds(new Set());
    } else {
      setSelectedPhotoIds(new Set(filteredPhotos.map(p => p.id as string)));
    }
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setShowUpload(true);
  };

  const totalCount = nhostPhotos.length;

  // Aggregate all photos to compute autocomplete dropdowns
  const allPhotos = useMemo(() => [...nhostPhotos], [nhostPhotos]);



  const existingShootingNames = useMemo(() => {
    return [...new Set(allPhotos.map(p => p.shootingName).filter(Boolean))].sort();
  }, [allPhotos]);

  const existingCategories = useMemo(() => {
    return [...new Set(allPhotos.map(p => p.category).filter(Boolean))].sort();
  }, [allPhotos]);

  const existingPhotomodels = useMemo(() => {
    const raw = allPhotos.map(p => p.photomodel).filter(Boolean);
    const splitVals = (raw as (string | string[])[]).flatMap(val =>
      Array.isArray(val) ? val : String(val).split(',').map(s => s.trim())
    ).filter(Boolean);
    return [...new Set(splitVals)].sort();
  }, [allPhotos]);

  const filteredPhotos = useMemo(() => {
    return nhostPhotos.filter(photo => {
      if (filters.category && photo.category !== filters.category) return false;
      if (filters.photomodel) {
        const models = Array.isArray(photo.photomodel) ? photo.photomodel : (photo.photomodel ? String(photo.photomodel).split(',').map(m => m.trim()) : []);
        if (!models.includes(filters.photomodel)) return false;
      }
      if (filters.search) {
        const haystack = `${photo.category} ${photo.shootingName} ${photo.title || ""} ${photo.photomodel || ""}`.toLowerCase();
        if (!haystack.includes(filters.search.toLowerCase())) return false;
      }
      return true;
    });
  }, [nhostPhotos, filters]);

  const groupedPhotos = useMemo(() => {
    const groups: Record<string, Photo[]> = {};
    filteredPhotos.forEach(photo => {
      const groupName = photo.shootingName || "Altro";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(photo);
    });

    // Sort photos within groups by most recent
    Object.values(groups).forEach(photos => {
      photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === "Altro") return 1;
      if (b === "Altro") return -1;
      // Sort groups by the date of their most recent photo
      const dateA = new Date(groups[a][0].date).getTime();
      const dateB = new Date(groups[b][0].date).getTime();
      return dateB - dateA;
    });

    return sortedKeys.map(key => ({
      shootingName: key,
      photos: groups[key]
    }));
  }, [filteredPhotos]);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>Isabel <span>Finaldi</span></h2>
          <small>Admin Panel</small>
        </div>
        <nav className="admin-nav">
          <a className="admin-nav-item admin-nav-item--active" href="#photos">📸 Foto</a>
          <a className="admin-nav-item" href="/" target="_blank">🌐 Vai al Sito</a>
        </nav>
        <button className="admin-btn admin-btn--ghost admin-logout" onClick={logout}>
          Esci →
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Gestione Foto</h1>
            <p className="admin-subtitle">
              {nhostPhotos.length} caricate
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedPhotoIds.size > 0 && (
              <button
                className="admin-btn admin-btn--danger"
                onClick={() => setDeleteBulkConfirm(true)}
              >
                🗑️ Elimina ({selectedPhotoIds.size})
              </button>
            )}
            <button
              className="admin-btn admin-btn--primary"
              onClick={() => { setEditingPhoto(null); setSaveError(""); setShowUpload(true); }}
            >
              + Carica Foto
            </button>
          </div>
        </header>

        {saveError && <p className="admin-error" style={{ padding: "0 var(--adm-space)" }}>{saveError}</p>}


        {/* ── Uploaded (Nhost) photos ── */}
        <section className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="admin-section-title" style={{ marginBottom: 0 }}>
              ☁️ Foto Caricate <span className="badge">{filteredPhotos.length}</span>
            </h3>
            {filteredPhotos.length > 0 && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={filteredPhotos.length > 0 && selectedPhotoIds.size === filteredPhotos.length}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
                Seleziona Tutte le Trovate
              </label>
            )}
          </div>

          {nhostPhotos.length > 0 && (
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Cerca foto..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-surface)', color: 'var(--adm-text)', outline: 'none' }}
              />
              <select
                value={filters.category}
                onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-surface)', color: 'var(--adm-text)', outline: 'none' }}
              >
                <option value="">Tutte le categorie</option>
                {existingCategories.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
              </select>
              <select
                value={filters.photomodel}
                onChange={e => setFilters(prev => ({ ...prev, photomodel: e.target.value }))}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-surface)', color: 'var(--adm-text)', outline: 'none' }}
              >
                <option value="">Tutti i modelli</option>
                {existingPhotomodels.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {(filters.search || filters.category || filters.photomodel) && (
                <button onClick={() => setFilters({ category: "", photomodel: "", search: "" })} className="admin-btn admin-btn--ghost" style={{ fontSize: '0.85rem', padding: '8px 12px' }}>
                  Resetta Filtri
                </button>
              )}
            </div>
          )}

          {loading ? (
            <p style={{ color: "var(--adm-muted)", padding: "var(--adm-space)" }}>Caricamento…</p>
          ) : fetchError ? (
            <p className="admin-error" style={{ padding: "var(--adm-space)" }}>{fetchError}</p>
          ) : nhostPhotos.length === 0 ? (
            <div className="admin-empty">
              <p>Nessuna foto caricata ancora.</p>
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => { setEditingPhoto(null); setSaveError(""); setShowUpload(true); }}
              >
                + Carica la prima foto
              </button>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="admin-empty">
              <p>Nessuna foto trovata con i filtri attuali.</p>
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => setFilters({ category: "", photomodel: "", search: "" })}
              >
                Resetta Filtri
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {groupedPhotos.map(group => (
                <div key={group.shootingName}>
                  <h4 style={{
                    marginBottom: '1.25rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--adm-border)',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    📸 {group.shootingName} <span className="badge" style={{ marginLeft: '8px' }}>{group.photos.length}</span>
                  </h4>
                  <div className="admin-grid">
                    {group.photos.map((photo) => (
                      <div key={photo.id} className={`admin-card ${selectedPhotoIds.has(photo.id as string) ? 'admin-card--selected' : ''}${verticalPhotos.has(photo.id as string) ? ' vertical' : ''}`} onClick={() => toggleSelection(photo.id as string)} style={{ cursor: 'pointer' }}>
                        <div className="admin-card-img">
                          <div
                            className="admin-card-select"
                            onClick={(e) => { e.stopPropagation(); toggleSelection(photo.id as string); }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPhotoIds.has(photo.id as string)}
                              onChange={() => { }}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                          <img src={photo.src} alt={(photo.title || photo.category).replace(/_/g, ' ')} title={(photo.title || photo.category).replace(/_/g, ' ')} onLoad={(e) => handleImageLoad(photo.id as string, e)} />
                          {photo.featured && <span className="admin-card-badge admin-card-badge--gold">⭐</span>}
                        </div>
                        <div className="admin-card-info">
                          {photo.title && (
                            <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{photo.title}</p>
                          )}
                          <p>{catLabel(photo.category)} · {formatDate(photo.date)}</p>
                          {photo.photomodel && (Array.isArray(photo.photomodel) ? photo.photomodel.length > 0 : true) && (
                            <p className="admin-card-model">
                              📷 {Array.isArray(photo.photomodel) ? photo.photomodel.join(', ') : photo.photomodel}
                            </p>
                          )}
                        </div>
                        <div className="admin-card-actions" onClick={(e) => e.stopPropagation()}>
                          <button className="admin-btn admin-btn--sm" onClick={() => handleEdit(photo)}>
                            ✏️ Modifica
                          </button>
                          <button
                            className="admin-btn admin-btn--sm admin-btn--danger"
                            onClick={() => setDeleteConfirm(photo)}
                          >
                            🗑️ Elimina
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Upload / Edit modal */}
      {showUpload && (
        <PhotoUploadForm
          photo={editingPhoto}
          onSave={handleSave}
          onCancel={() => { setShowUpload(false); setEditingPhoto(null); setSaveError(""); }}
          saving={saving}
          saveError={saveError}

          existingShootingNames={existingShootingNames}
          existingPhotomodels={existingPhotomodels}
        />
      )}

      {/* Bulk Delete confirmation */}
      {deleteBulkConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteBulkConfirm(false)}>
          <div className="modal-box modal-box--sm" onClick={(e) => e.stopPropagation()}>
            <h3>Eliminare le {selectedPhotoIds.size} foto selezionate?</h3>
            <p>Questa azione non può essere annullata. I file verranno rimossi da Nhost Storage.</p>
            <div className="modal-actions">
              <button className="admin-btn" onClick={() => setDeleteBulkConfirm(false)} disabled={!!saving}>Annulla</button>
              <button
                className="admin-btn admin-btn--danger"
                onClick={handleBulkDelete}
                disabled={!!saving}
              >
                {saving ? "Eliminazione…" : "Sì, elimina tutte"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box modal-box--sm" onClick={(e) => e.stopPropagation()}>
            <h3>Eliminare questa foto?</h3>
            <p>Questa azione non può essere annullata. Il file verrà rimosso anche da Nhost Storage.</p>
            <div className="modal-actions">
              <button className="admin-btn" onClick={() => setDeleteConfirm(null)} disabled={!!saving}>Annulla</button>
              <button
                className="admin-btn admin-btn--danger"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={!!saving}
              >
                {saving ? "Eliminazione…" : "Sì, elimina"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

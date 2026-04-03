import { useState, useMemo } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useLang } from "../../context/LanguageContext";
import { PHOTOS, formatDate } from "../../data/photos";
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
  const [saving, setSaving] = useState<boolean | string>(false);
  const [saveError, setSaveError] = useState("");

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
      await deleteNhostPhoto(photo.id as string);
      await refresh();
    } catch (err) {
      setSaveError((err as Error).message ?? "Errore nella cancellazione.");
    } finally {
      setSaving(false);
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setShowUpload(true);
  };

  const totalCount = /* PHOTOS.length +  */nhostPhotos.length;

  // Aggregate all photos to compute autocomplete dropdowns
  const allPhotos = useMemo(() => [...PHOTOS, ...nhostPhotos], [nhostPhotos]);



  const existingShootingNames = useMemo(() => {
    return [...new Set(allPhotos.map(p => p.shootingName).filter(Boolean))].sort();
  }, [allPhotos]);

  const existingPhotomodels = useMemo(() => {
    const raw = allPhotos.map(p => p.photomodel).filter(Boolean);
    const splitVals = (raw as (string | string[])[]).flatMap(val =>
      Array.isArray(val) ? val : String(val).split(',').map(s => s.trim())
    ).filter(Boolean);
    return [...new Set(splitVals)].sort();
  }, [allPhotos]);

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
              {/* {PHOTOS.length} foto integrate ·  */}{nhostPhotos.length} caricate · {totalCount} totali
            </p>
          </div>
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => { setEditingPhoto(null); setSaveError(""); setShowUpload(true); }}
          >
            + Carica Foto
          </button>
        </header>

        {saveError && <p className="admin-error" style={{ padding: "0 var(--adm-space)" }}>{saveError}</p>}

        {/* ── Static (integrated) photos ── */}
        {/* <section className="admin-section" id="photos">
          <h3 className="admin-section-title">
            📸 Foto Integrate <span className="badge">{PHOTOS.length}</span>
          </h3>
          <div className="admin-grid">
            {PHOTOS.map((photo) => (
              <div key={photo.id} className="admin-card admin-card--static">
                <div className="admin-card-img">
                  <img src={photo.src} alt={photo.category} />
                  <span className="admin-card-badge">Integrata</span>
                </div>
                <div className="admin-card-info">
                  <p>{catLabel(photo.category)} · {formatDate(photo.date)}</p>
                  {photo.featured && <span className="badge badge--gold">⭐ In evidenza</span>}
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* ── Uploaded (Nhost) photos ── */}
        <section className="admin-section">
          <h3 className="admin-section-title">
            ☁️ Foto Caricate <span className="badge">{nhostPhotos.length}</span>
          </h3>

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
          ) : (
            <div className="admin-grid">
              {nhostPhotos.map((photo) => (
                <div key={photo.id} className="admin-card">
                  <div className="admin-card-img">
                    <img src={photo.src} alt={(photo.title || photo.category).replace(/_/g, ' ')} title={(photo.title || photo.category).replace(/_/g, ' ')} />
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
                  <div className="admin-card-actions">
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

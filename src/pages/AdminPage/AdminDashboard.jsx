import { useState, useCallback } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  PHOTOS,
  getCustomPhotos,
  getStaticOverrides,
  saveCustomPhoto,
  updateCustomPhoto,
  deleteCustomPhoto,
  updateStaticOverride,
  resetStaticOverride,
  formatDate,
} from "../../data/photos";
import PhotoUploadForm from "./PhotoUploadForm";

export default function AdminDashboard() {
  const { logout } = useAdminAuth();
  const [customPhotos, setCustomPhotos] = useState(getCustomPhotos);
  const [staticOverrides, setStaticOverrides] = useState(getStaticOverrides);
  const [showUpload, setShowUpload] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(null);

  const refreshCustom = useCallback(() => setCustomPhotos(getCustomPhotos()), []);
  const refreshOverrides = useCallback(() => setStaticOverrides(getStaticOverrides()), []);

  // Merge a static photo with its override (if any) for display
  const withOverride = (photo) => ({
    ...photo,
    ...(staticOverrides[photo.id] ?? {}),
  });

  const handleSave = (formData) => {
    if (editingPhoto?.custom) {
      updateCustomPhoto(editingPhoto.id, formData);
      refreshCustom();
    } else if (editingPhoto) {
      // Static photo — save only the changed metadata fields (not src)
      const { src, id, custom, ...metaOnly } = formData; // eslint-disable-line no-unused-vars
      updateStaticOverride(editingPhoto.id, metaOnly);
      refreshOverrides();
    } else {
      saveCustomPhoto(formData);
      refreshCustom();
    }
    setShowUpload(false);
    setEditingPhoto(null);
  };

  const handleDelete = (id) => {
    deleteCustomPhoto(id);
    refreshCustom();
    setDeleteConfirm(null);
  };

  const handleReset = (id) => {
    resetStaticOverride(id);
    refreshOverrides();
    setResetConfirm(null);
  };

  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setShowUpload(true);
  };

  const totalCount = PHOTOS.length + customPhotos.length;

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
              {PHOTOS.length} foto integrate · {customPhotos.length} caricate · {totalCount} totali
              {Object.keys(staticOverrides).length > 0 && (
                <> · <span style={{ color: "var(--adm-accent)" }}>{Object.keys(staticOverrides).length} modificate</span></>
              )}
            </p>
          </div>
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => { setEditingPhoto(null); setShowUpload(true); }}
          >
            + Carica Foto
          </button>
        </header>

        {/* ── Static (integrated) photos ── */}
        <section className="admin-section" id="photos">
          <h3 className="admin-section-title">
            📸 Foto Integrate <span className="badge">{PHOTOS.length}</span>
          </h3>
          <div className="admin-grid">
            {PHOTOS.map((photo) => {
              const displayed = withOverride(photo);
              const hasOverride = !!staticOverrides[photo.id];
              return (
                <div key={photo.id} className={`admin-card${hasOverride ? " admin-card--modified" : " admin-card--static"}`}>
                  <div className="admin-card-img">
                    <img src={displayed.src} alt={displayed.title} />
                    <span className="admin-card-badge">
                      {hasOverride ? "✏️ Modificata" : "Integrata"}
                    </span>
                  </div>
                  <div className="admin-card-info">
                    <h4>{displayed.title}</h4>
                    <p>{displayed.category} · {formatDate(displayed.date)}</p>
                    {displayed.featured && <span className="badge badge--gold">⭐ In evidenza</span>}
                    <p className="admin-card-votes">♥ {displayed.votes} voti</p>
                  </div>
                  <div className="admin-card-actions">
                    <button className="admin-btn admin-btn--sm" onClick={() => handleEdit(displayed)}>
                      ✏️ Modifica
                    </button>
                    {hasOverride && (
                      <button
                        className="admin-btn admin-btn--sm admin-btn--danger"
                        onClick={() => setResetConfirm(photo.id)}
                        title="Ripristina valori originali"
                      >
                        ↩ Reset
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Uploaded custom photos ── */}
        <section className="admin-section">
          <h3 className="admin-section-title">
            ☁️ Foto Caricate <span className="badge">{customPhotos.length}</span>
          </h3>
          {customPhotos.length === 0 ? (
            <div className="admin-empty">
              <p>Nessuna foto caricata ancora.</p>
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => { setEditingPhoto(null); setShowUpload(true); }}
              >
                + Carica la prima foto
              </button>
            </div>
          ) : (
            <div className="admin-grid">
              {customPhotos.map((photo) => (
                <div key={photo.id} className="admin-card">
                  <div className="admin-card-img">
                    <img src={photo.src} alt={photo.title} />
                    {photo.featured && <span className="admin-card-badge admin-card-badge--gold">⭐</span>}
                  </div>
                  <div className="admin-card-info">
                    <h4>{photo.title}</h4>
                    <p>{photo.category} · {formatDate(photo.date)}</p>
                    {photo.photomodel && <p className="admin-card-model">📷 {photo.photomodel}</p>}
                    <p className="admin-card-votes">♥ {photo.votes} voti</p>
                  </div>
                  <div className="admin-card-actions">
                    <button className="admin-btn admin-btn--sm" onClick={() => handleEdit(photo)}>
                      ✏️ Modifica
                    </button>
                    <button
                      className="admin-btn admin-btn--sm admin-btn--danger"
                      onClick={() => setDeleteConfirm(photo.id)}
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
          onCancel={() => { setShowUpload(false); setEditingPhoto(null); }}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box modal-box--sm" onClick={(e) => e.stopPropagation()}>
            <h3>Eliminare questa foto?</h3>
            <p>Questa azione non può essere annullata.</p>
            <div className="modal-actions">
              <button className="admin-btn" onClick={() => setDeleteConfirm(null)}>Annulla</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(deleteConfirm)}>
                Sì, elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset-to-original confirmation */}
      {resetConfirm && (
        <div className="modal-overlay" onClick={() => setResetConfirm(null)}>
          <div className="modal-box modal-box--sm" onClick={(e) => e.stopPropagation()}>
            <h3>Ripristinare i valori originali?</h3>
            <p>Le modifiche apportate a questa foto verranno annullate e verrà ripristinata la versione originale.</p>
            <div className="modal-actions">
              <button className="admin-btn" onClick={() => setResetConfirm(null)}>Annulla</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleReset(resetConfirm)}>
                Sì, ripristina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

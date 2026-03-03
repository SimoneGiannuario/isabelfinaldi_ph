import { useState, useRef } from "react";
import { CATEGORIES } from "../../data/photos";

const EMPTY_FORM = {
  title: "",
  category: "Portrait",
  shootingName: "",
  photomodel: "",
  date: new Date().toISOString().slice(0, 10),
  featured: false,
  votes: 0,
};

export default function PhotoUploadForm({ photo, onSave, onCancel }) {
  const isEdit = !!photo;
  const [form, setForm] = useState(isEdit ? { ...photo } : EMPTY_FORM);
  const [previewSrc, setPreviewSrc] = useState(isEdit ? photo.src : null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Seleziona un file immagine valido (JPG, PNG, WebP…)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewSrc(e.target.result);
      set("src", e.target.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEdit && !previewSrc) { setError("Carica un'immagine prima di salvare."); return; }
    if (!form.title.trim()) { setError("Il titolo è obbligatorio."); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>{isEdit ? "Modifica Foto" : "Carica Nuova Foto"}</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Chiudi">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Drop zone */}
          {!isEdit && (
            <div
              className={`drop-zone${dragging ? " drop-zone--active" : ""}${previewSrc ? " drop-zone--filled" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current.click()}
            >
              {previewSrc ? (
                <img src={previewSrc} alt="Anteprima" className="drop-preview" />
              ) : (
                <div className="drop-hint">
                  <span className="drop-icon">📷</span>
                  <p>Trascina qui un'immagine<br /><small>oppure clicca per sfogliare</small></p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => processFile(e.target.files[0])}
              />
            </div>
          )}

          {/* Metadata fields */}
          <div className="upload-fields">
            <div className="admin-field">
              <label>Titolo *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Es. Luce d'Estate" required />
            </div>
            <div className="admin-field">
              <label>Categoria *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {(CATEGORIES ?? ["Portrait", "Landscape", "Street", "Events", "Creative"]).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Nome Sessione</label>
              <input value={form.shootingName} onChange={(e) => set("shootingName", e.target.value)} placeholder="Es. Golden Hour Session" />
            </div>
            <div className="admin-field">
              <label>Fotomodella</label>
              <input value={form.photomodel ?? ""} onChange={(e) => set("photomodel", e.target.value || null)} placeholder="Es. Giulia Marchetti (opzionale)" />
            </div>
            <div className="admin-field">
              <label>Data</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div className="admin-field admin-field--row">
              <label>In evidenza (homepage)</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {error && <p className="admin-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="admin-btn" onClick={onCancel}>Annulla</button>
            <button type="submit" className="admin-btn admin-btn--primary">
              {isEdit ? "Salva Modifiche" : "Carica Foto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

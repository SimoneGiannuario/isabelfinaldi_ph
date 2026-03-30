import { useState, useRef, type FormEvent, type DragEvent, type ChangeEvent } from "react";
import { CATEGORIES } from "../../data/photos";
import type { Photo } from "../../types/photo";
import type { PhotoUploadMeta } from "../../data/nhostPhotos";

interface FormData {
  category: string;
  shootingName: string;
  photomodel: string;
  date: string;
  featured: boolean;
  votes: number;
}

const EMPTY_FORM: FormData = {
  category: "Portrait",
  shootingName: "",
  photomodel: "",
  date: new Date().toISOString().slice(0, 10),
  featured: false,
  votes: 0,
};

interface UploadItem {
  file: File | null;
  previewSrc: string;
  form: FormData;
}

interface PhotoUploadFormProps {
  photo: Photo | null;
  onSave: (data: PhotoUploadMeta | Array<PhotoUploadMeta & { file: File }>) => void;
  onCancel: () => void;
  saving: boolean | string;
  saveError: string;
  existingShootingNames?: string[];
  existingPhotomodels?: string[];
}

/**
 * PhotoUploadForm
 * For new uploads: passes array of { ...meta, file: File } to onSave.
 * For edits:       passes { ...meta } (no file — only metadata changes).
 */
export default function PhotoUploadForm({
  photo, onSave, onCancel, saving, saveError,
  existingShootingNames = [],
  existingPhotomodels = []
}: PhotoUploadFormProps) {
  const isEdit = !!photo;

  // Nhost now returns an array for photomodels, but we want the user to type a comma string
  const initialPhoto: FormData = isEdit ? {
    category: photo.category,
    shootingName: photo.shootingName,
    photomodel: Array.isArray(photo.photomodel) ? photo.photomodel.join(', ') : (photo.photomodel || ""),
    date: photo.date,
    featured: photo.featured,
    votes: photo.votes,
  } : EMPTY_FORM;

  // For multi-upload, we keep an array of items: { file, previewSrc, form }
  // When editing, we just have one item representing the existing photo.
  const [items, setItems] = useState<UploadItem[]>(
    isEdit ? [{ form: initialPhoto, previewSrc: photo.src, file: null }] : []
  );

  // Which item in the `items` array is currently being edited in the form
  const [currentIndex, setCurrentIndex] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // The active form data
  const currentForm = items.length > 0 ? items[currentIndex].form : EMPTY_FORM;

  // Local state for the photomodel autocomplete input
  const [modelInput, setModelInput] = useState("");
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showShootingSuggestions, setShowShootingSuggestions] = useState(false);


  // Compute available shooting suggestions
  const availableShootingSuggestions = existingShootingNames.filter(s =>
    s.toLowerCase().includes((currentForm.shootingName || "").toLowerCase()) && s !== currentForm.shootingName
  );

  // Compute remaining models that are NOT yet in the current form's photomodel string
  const currentModels = (currentForm.photomodel || "").split(',').map(m => m.trim()).filter(Boolean);
  const availableModelSuggestions = existingPhotomodels.filter(m =>
    !currentModels.includes(m) &&
    m.toLowerCase().includes(modelInput.toLowerCase())
  );

  const handleAddModel = (modelName: string) => {
    const newString = currentModels.length > 0
      ? currentModels.join(', ') + ', ' + modelName
      : modelName;
    setFormKey("photomodel", newString);
    setModelInput("");
    setShowModelSuggestions(false);
  };

  const setFormKey = (key: keyof FormData, val: string | boolean | number) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[currentIndex] = {
        ...newItems[currentIndex],
        form: { ...newItems[currentIndex].form, [key]: val }
      };
      return newItems;
    });
  };

  const processFiles = (fileList: FileList) => {
    const newItems: UploadItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (f.type.startsWith("image/")) {
        newItems.push({
          file: f,
          previewSrc: URL.createObjectURL(f),
          form: { ...EMPTY_FORM } // fresh form for each new image
        });
      }
    }

    if (newItems.length === 0) {
      setError("Seleziona almeno un file immagine valido (JPG, PNG, WebP…)");
      return;
    }

    setItems((prev) => [...prev, ...newItems]);
    setError("");
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEdit && items.length === 0) { setError("Carica almeno un'immagine prima di salvare."); return; }

    if (isEdit) {
      onSave({ ...items[0].form });
    } else {
      // Return array of { ...form, file }
      onSave(items.map(item => ({ ...item.form, file: item.file as File })));
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>{isEdit ? "Modifica Foto" : "Carica Nuova Foto"}</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Chiudi">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Drop zone — only for new uploads */}
          {!isEdit && (
            <div
              className={`drop-zone${dragging ? " drop-zone--active" : ""}${items.length > 0 ? " drop-zone--filled" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              style={items.length > 0 ? { padding: '20px' } : {}}
            >
              {items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={items[currentIndex].previewSrc}
                    alt={`Anteprima ${currentIndex + 1}`}
                    className="drop-preview"
                    style={{ maxHeight: '150px', width: 'auto', objectFit: 'contain' }}
                  />
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Foto {currentIndex + 1} di {items.length}
                    {items.length < 50 && (
                      <span style={{ marginLeft: '10px', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>
                        + Aggiungi altre
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="drop-hint">
                  <span className="drop-icon">📷</span>
                  <p>Trascina qui le immagini<br /><small>oppure clicca per sfogliare</small></p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && processFiles(e.target.files)}
              />
            </div>
          )}

          {/* Metadata fields */}
          {items.length > 0 && (
            <div className="upload-fields">
              <div className="admin-field">
                <label>Categoria *</label>
                <select value={currentForm.category} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormKey("category", e.target.value)}>
                  {(CATEGORIES ?? ["Portrait", "Landscape", "Street", "Events", "Creative"]).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="admin-field" style={{ position: 'relative' }}>
                <label>Nome Sessione</label>
                <input
                  value={currentForm.shootingName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setFormKey("shootingName", e.target.value);
                    setShowShootingSuggestions(true);
                  }}
                  onFocus={() => setShowShootingSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowShootingSuggestions(false), 200)}
                  placeholder="Es. Golden Hour Session"
                />
                {showShootingSuggestions && availableShootingSuggestions.length > 0 && currentForm.shootingName && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'var(--adm-surface)', border: '1px solid var(--adm-border)',
                    zIndex: 10, borderRadius: '4px', marginTop: '4px',
                    maxHeight: '150px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    {availableShootingSuggestions.map(s => (
                      <div
                        key={s}
                        onClick={() => {
                          setFormKey("shootingName", s);
                          setShowShootingSuggestions(false);
                        }}
                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--adm-border)' }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="admin-field">
                <label>Fotomodella/i</label>

                {/* Visual String representation */}
                <input
                  value={currentForm.photomodel ?? ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormKey("photomodel", e.target.value || "")}
                  placeholder="Elenco finale (modificabile): Es. Giulia, Marco"
                  style={{ marginBottom: '5px' }}
                />

                {/* Autocomplete Input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={modelInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setModelInput(e.target.value);
                      setShowModelSuggestions(true);
                    }}
                    onFocus={() => setShowModelSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowModelSuggestions(false), 200)}
                    placeholder="+ Cerca o aggiungi modella/o"
                    style={{ background: 'var(--adm-surface-hover)', width: '100%' }}
                  />

                  {/* Suggestions Dropdown */}
                  {showModelSuggestions && modelInput.trim().length > 0 && availableModelSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: 'var(--adm-surface)', border: '1px solid var(--adm-border)',
                      zIndex: 10, borderRadius: '4px', marginTop: '4px',
                      maxHeight: '150px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      {availableModelSuggestions.map(m => (
                        <div
                          key={m}
                          onClick={() => handleAddModel(m)}
                          style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--adm-border)' }}
                        >
                          {m}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-field">
                <label>Data</label>
                <input type="date" value={currentForm.date} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormKey("date", e.target.value)} />
              </div>
              <div className="admin-field admin-field--row">
                <label>In evidenza (homepage)</label>
                <label className="toggle-switch">
                  <input type="checkbox" checked={currentForm.featured} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormKey("featured", e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          )}

          {(error || saveError) && <p className="admin-error">{error || saveError}</p>}

          <div className="modal-actions" style={{ justifyContent: items.length > 1 ? 'space-between' : 'flex-end', display: 'flex', width: '100%' }}>
            {items.length > 1 && (
              <div className="pagination-actions" style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="admin-btn" disabled={currentIndex === 0 || !!saving} onClick={() => setCurrentIndex(c => c - 1)}>
                  &laquo; Precedente
                </button>
                <button type="button" className="admin-btn" disabled={currentIndex === items.length - 1 || !!saving} onClick={() => setCurrentIndex(c => c + 1)}>
                  Successiva &raquo;
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="admin-btn" onClick={onCancel} disabled={!!saving}>Annulla</button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={!!saving || items.length === 0}>
                {saving ? "Salvataggio…" : isEdit ? "Salva Modifiche" : (items.length > 1 ? `Carica ${items.length} Foto` : "Carica Foto")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

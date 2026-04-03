import { useState, useRef, type FormEvent, type DragEvent, type ChangeEvent } from "react";
import { CATEGORIES } from "../../data/photos";
import { useLang } from "../../context/LanguageContext";
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
  category: "Ritratto",
  shootingName: "",
  photomodel: "",
  date: new Date().toISOString().slice(0, 10),
  featured: false,
  votes: 0,
};

interface UploadFile {
  file: File;
  previewSrc: string;
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
 * For new uploads: user enters metadata ONCE, it applies to ALL selected images.
 *                  Title is auto-generated as: Category - ShootingName - 001, 002, ...
 * For edits:       passes { ...meta } (no file — only metadata changes).
 */
export default function PhotoUploadForm({
  photo, onSave, onCancel, saving, saveError,
  existingShootingNames = [],
  existingPhotomodels = []
}: PhotoUploadFormProps) {
  const isEdit = !!photo;
  const { t } = useLang();
  const catLabel = (c: string) => t.gallery.categories[c] || c;

  const initialForm: FormData = isEdit ? {
    category: photo.category,
    shootingName: photo.shootingName,
    photomodel: Array.isArray(photo.photomodel) ? photo.photomodel.join(', ') : (photo.photomodel || ""),
    date: photo.date,
    featured: photo.featured,
    votes: photo.votes,
  } : EMPTY_FORM;

  // Single shared form for all images (or the one being edited)
  const [form, setForm] = useState<FormData>(initialForm);

  // Files to upload (only for new uploads)
  const [files, setFiles] = useState<UploadFile[]>([]);

  // Which file preview is currently shown
  const [previewIndex, setPreviewIndex] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Local state for the photomodel autocomplete input
  const [modelInput, setModelInput] = useState("");
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [showShootingSuggestions, setShowShootingSuggestions] = useState(false);

  // Auto-generated title: category_sessionName_progressiveNumber
  const generateTitle = (index: number) => {
    const parts: string[] = [];
    if (form.category) parts.push(form.category);
    if (form.shootingName) parts.push(form.shootingName);
    parts.push(String(index + 1).padStart(3, '0'));
    return parts.join('_');
  };

  // Compute available shooting suggestions
  const availableShootingSuggestions = existingShootingNames.filter(s =>
    s.toLowerCase().includes((form.shootingName || "").toLowerCase()) && s !== form.shootingName
  );

  // Compute remaining models that are NOT yet in the current form's photomodel string
  const currentModels = (form.photomodel || "").split(',').map(m => m.trim()).filter(Boolean);
  const availableModelSuggestions = existingPhotomodels.filter(m =>
    !currentModels.includes(m) &&
    m.toLowerCase().includes(modelInput.toLowerCase())
  );

  const handleAddModel = (modelName: string) => {
    const newString = currentModels.length > 0
      ? currentModels.join(', ') + ', ' + modelName
      : modelName;
    setForm(prev => ({ ...prev, photomodel: newString }));
    setModelInput("");
    setShowModelSuggestions(false);
  };

  const setFormKey = (key: keyof FormData, val: string | boolean | number) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (f.type.startsWith("image/")) {
        newFiles.push({
          file: f,
          previewSrc: URL.createObjectURL(f),
        });
      }
    }

    if (newFiles.length === 0) {
      setError("Seleziona almeno un file immagine valido (JPG, PNG, WebP…)");
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setError("");
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== index);
      // Adjust preview index if needed
      if (previewIndex >= next.length && next.length > 0) {
        setPreviewIndex(next.length - 1);
      } else if (next.length === 0) {
        setPreviewIndex(0);
      }
      return next;
    });
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEdit && files.length === 0) { setError("Carica almeno un'immagine prima di salvare."); return; }

    if (isEdit) {
      // For edits, keep a simple progressive title
      const title = generateTitle(0);
      onSave({ ...form, title });
    } else {
      // Return array of { ...form, title, file } with progressive titles
      onSave(files.map((item, i) => ({
        ...form,
        title: generateTitle(i),
        file: item.file,
      })));
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
              className={`drop-zone${dragging ? " drop-zone--active" : ""}${files.length > 0 ? " drop-zone--filled" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              style={files.length > 0 ? { padding: '12px' } : {}}
            >
              {files.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
                  {/* Thumbnails strip */}
                  <div style={{
                    display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center',
                    maxHeight: '120px', overflowY: 'auto', width: '100%', padding: '4px'
                  }}>
                    {files.map((f, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'relative',
                          border: previewIndex === i ? '2px solid var(--accent)' : '2px solid transparent',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        onClick={(e) => { e.stopPropagation(); setPreviewIndex(i); }}
                      >
                        <img
                          src={f.previewSrc}
                          alt={`Foto ${i + 1}`}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: '#e74c3c', color: '#fff', border: 'none',
                            fontSize: '10px', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                            padding: 0,
                          }}
                          aria-label={`Rimuovi foto ${i + 1}`}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {files.length} {files.length === 1 ? 'foto selezionata' : 'foto selezionate'}
                    <span
                      style={{ marginLeft: '10px', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                    >
                      + Aggiungi altre
                    </span>
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

          {/* Metadata fields — shown when there are files (or editing) */}
          {(files.length > 0 || isEdit) && (
            <div className="upload-fields">
              {/* Auto-generated title preview */}
              <div className="admin-field">
                <label>Titolo (auto-generato)</label>
                <div style={{
                  padding: '8px 12px',
                  background: 'var(--adm-surface-hover, #f5f5f5)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: 'var(--adm-text, #333)',
                  border: '1px solid var(--adm-border, #ddd)',
                  fontStyle: 'italic',
                }}>
                  {isEdit
                    ? generateTitle(0)
                    : files.length > 1
                      ? (<>
                          {generateTitle(0)} … {generateTitle(files.length - 1)}
                          <span style={{ marginLeft: '8px', fontSize: '11px', color: '#999' }}>
                            ({files.length} foto)
                          </span>
                        </>)
                      : generateTitle(0)
                  }
                </div>
                <small style={{ color: '#999', marginTop: '2px', display: 'block' }}>
                  Formato: Categoria_Sessione_N° (es. Ritratto_GoldenHour_001)
                </small>
              </div>

              <div className="admin-field">
                <label>Categoria *</label>
                <select value={form.category} onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormKey("category", e.target.value)}>
                  {(CATEGORIES ?? ["Ritratto", "Paesaggio", "Street", "Eventi", "Creativo"]).map((c) => (
                    <option key={c} value={c}>{catLabel(c)}</option>
                  ))}
                </select>
              </div>
              <div className="admin-field" style={{ position: 'relative' }}>
                <label>Nome Sessione</label>
                <input
                  value={form.shootingName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setFormKey("shootingName", e.target.value);
                    setShowShootingSuggestions(true);
                  }}
                  onFocus={() => setShowShootingSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowShootingSuggestions(false), 200)}
                  placeholder="Es. Golden Hour Session"
                />
                {showShootingSuggestions && availableShootingSuggestions.length > 0 && form.shootingName && (
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
                  value={form.photomodel ?? ""}
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
                <input type="date" value={form.date} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormKey("date", e.target.value)} />
              </div>
              <div className="admin-field admin-field--row">
                <label>In evidenza (homepage)</label>
                <label className="toggle-switch">
                  <input type="checkbox" checked={form.featured} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormKey("featured", e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          )}

          {(error || saveError) && <p className="admin-error">{error || saveError}</p>}

          <div className="modal-actions" style={{ justifyContent: 'flex-end', display: 'flex', width: '100%' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="admin-btn" onClick={onCancel} disabled={!!saving}>Annulla</button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={!!saving || (!isEdit && files.length === 0)}>
                {saving ? "Salvataggio…" : isEdit ? "Salva Modifiche" : (files.length > 1 ? `Carica ${files.length} Foto` : "Carica Foto")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

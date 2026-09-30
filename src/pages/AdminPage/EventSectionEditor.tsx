import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from 'react';
import DOMPurify from 'dompurify';
import {
  fetchAdminHomepageEvent,
  saveHomepageEvent,
  type HomepageEvent,
  type HomepageEventCopy,
} from '../../data/nhostPhotos';

type Language = 'it' | 'en';

interface EventForm {
  expiresAt: string;
  translations: Record<Language, HomepageEventCopy>;
}

const emptyCopy = (): HomepageEventCopy => ({ title1: '', title2: '', description: '<p></p>' });
const emptyForm = (): EventForm => ({
  expiresAt: '',
  translations: { it: emptyCopy(), en: emptyCopy() },
});

function toLocalDateTimeInput(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

const richTextConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
};

interface EventSectionEditorProps {
  onClose: () => void;
}

export default function EventSectionEditor({ onClose }: EventSectionEditorProps) {
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [savedEvent, setSavedEvent] = useState<HomepageEvent | null>(null);
  const [language, setLanguage] = useState<Language>('it');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetchAdminHomepageEvent()
      .then((event) => {
        if (!active) return;
        setSavedEvent(event);
        if (event) setForm({ expiresAt: toLocalDateTimeInput(event.expiresAt), translations: event.translations });
      })
      .catch((loadError: unknown) => {
        if (active) setError((loadError as Error).message || 'Errore nel caricamento.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setLoaded(true);
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const updateCopy = (key: keyof HomepageEventCopy, value: string) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [language]: { ...current.translations[language], [key]: value },
      },
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : '');
  };

  const formatText = (command: string) => {
    let value: string | undefined;
    if (command === 'createLink') {
      const url = window.prompt('URL del link');
      if (!url || !/^(https?:|mailto:)/i.test(url)) return;
      value = url;
    }
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) updateCopy('description', editorRef.current.innerHTML);
  };

  const sanitizeEditor = () => {
    if (!editorRef.current) return;
    const sanitized = DOMPurify.sanitize(editorRef.current.innerHTML, richTextConfig);
    editorRef.current.innerHTML = sanitized;
    updateCopy('description', sanitized || '<p></p>');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const translations = {
        it: { ...form.translations.it, description: DOMPurify.sanitize(form.translations.it.description, richTextConfig) },
        en: { ...form.translations.en, description: DOMPurify.sanitize(form.translations.en.description, richTextConfig) },
      };
      const result = await saveHomepageEvent({
        ...form,
        expiresAt: new Date(form.expiresAt).toISOString(),
        translations,
        imageUrl: savedEvent?.imageUrl || '',
        file: imageFile || undefined,
      });
      setSavedEvent(result);
      setForm({ expiresAt: toLocalDateTimeInput(result.expiresAt), translations: result.translations });
      setImageFile(null);
      setImagePreview('');
    } catch (saveError) {
      setError((saveError as Error).message || 'Errore nel salvataggio.');
    } finally {
      setSaving(false);
    }
  };

  const copy = form.translations[language];
  const currentImage = imagePreview || savedEvent?.imageUrl;

  return (
    <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box event-editor-modal">
        <div className="modal-header">
          <div>
            <h2>Sezione evento homepage</h2>
            <p className="admin-subtitle">L’immagine viene caricata nella cartella R2 /events.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Chiudi">✕</button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--adm-muted)' }}>Caricamento evento…</p>
        ) : (
          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="event-editor-layout">
              <div className="event-editor-image">
                {currentImage ? <img src={currentImage} alt="Anteprima immagine evento" /> : <span>Seleziona un’immagine</span>}
                <label className="admin-btn">
                  {currentImage ? 'Cambia immagine' : 'Carica immagine'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              </div>

              <div className="event-editor-fields">
                <div className="admin-field">
                  <label htmlFor="event-expires-at">Data e ora di scadenza *</label>
                  <input
                    id="event-expires-at"
                    type="datetime-local"
                    step="60"
                    required
                    value={form.expiresAt}
                    onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))}
                  />
                </div>

                <div className="event-language-tabs" role="tablist" aria-label="Lingua dei contenuti evento">
                  <button type="button" role="tab" aria-selected={language === 'it'} className={language === 'it' ? 'active' : ''} onClick={() => setLanguage('it')}>Italiano</button>
                  <button type="button" role="tab" aria-selected={language === 'en'} className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>English</button>
                </div>

                <div className="admin-field">
                  <label htmlFor="event-title-1">Titolo 1 *</label>
                  <input id="event-title-1" required value={copy.title1} onChange={(event) => updateCopy('title1', event.target.value)} />
                </div>
                <div className="admin-field">
                  <label htmlFor="event-title-2">Titolo 2 *</label>
                  <input id="event-title-2" required value={copy.title2} onChange={(event) => updateCopy('title2', event.target.value)} />
                </div>

                <div className="admin-field">
                  <label>Descrizione formattata *</label>
                  <div className="event-rich-toolbar" role="toolbar" aria-label="Formattazione descrizione">
                    <button type="button" aria-label="Grassetto" title="Grassetto" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('bold')}><strong>B</strong></button>
                    <button type="button" aria-label="Corsivo" title="Corsivo" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('italic')}><em>I</em></button>
                    <button type="button" aria-label="Sottolineato" title="Sottolineato" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('underline')}><u>U</u></button>
                    <button type="button" aria-label="Elenco puntato" title="Elenco puntato" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('insertUnorderedList')}>• List</button>
                    <button type="button" aria-label="Elenco numerato" title="Elenco numerato" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('insertOrderedList')}>1. List</button>
                    <button type="button" aria-label="Inserisci link" title="Inserisci link" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('createLink')}>Link</button>
                  </div>
                  {loaded && (
                    <div
                      ref={editorRef}
                      className="event-rich-editor"
                      contentEditable
                      role="textbox"
                      aria-label={`Descrizione evento in ${language === 'it' ? 'italiano' : 'inglese'}`}
                      aria-multiline="true"
                      suppressContentEditableWarning
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(copy.description, richTextConfig) }}
                      onInput={(event) => updateCopy('description', event.currentTarget.innerHTML)}
                      onBlur={sanitizeEditor}
                    />
                  )}
                </div>
              </div>
            </div>

            {error && <p className="admin-error">{error}</p>}
            <div className="modal-actions">
              <button type="button" className="admin-btn" onClick={onClose} disabled={saving}>Chiudi</button>
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving || (!savedEvent && !imageFile)}>
                {saving ? 'Salvataggio…' : 'Salva evento'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
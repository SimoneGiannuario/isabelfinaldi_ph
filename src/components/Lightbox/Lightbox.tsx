import { useEffect, useRef } from "react";
import { formatDate, getSrcSet } from "../../data/photos";
import type { Photo } from "../../types/photo";
import "./Lightbox.css";

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  /** Current 1-based index (for screen reader announcement) */
  currentIndex?: number;
  /** Total photos count (for screen reader announcement) */
  totalPhotos?: number;
}

export default function Lightbox({ photo, onClose, onPrev, onNext, currentIndex, totalPhotos }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Auto-focus close button when lightbox opens
  useEffect(() => {
    closeRef.current?.focus();
  }, [photo]);

  // Focus trap: keep Tab cycling within the lightbox
  useEffect(() => {
    if (!photo) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = document.querySelectorAll<HTMLElement>(
        ".lightbox button"
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [photo]);

  if (!photo) return null;

  const metaParts: string[] = [photo.category, photo.shootingName];
  if (photo.photomodel) {
    metaParts.push(
      Array.isArray(photo.photomodel) ? photo.photomodel.join(", ") : photo.photomodel
    );
  }
  metaParts.push(formatDate(photo.date));

  const positionLabel = currentIndex && totalPhotos
    ? `Foto ${currentIndex} di ${totalPhotos}: ${photo.title}`
    : photo.title;

  return (
    <div
      className="lightbox active"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={positionLabel}
    >
      <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Chiudi lightbox">✕</button>
      <button className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label="Foto precedente">‹</button>
      <div className="lightbox-content">
        <img
          src={photo.src}
          srcSet={getSrcSet(photo.src)}
          sizes="100vw"
          alt={photo.title} />
      </div>
      <button className="lightbox-nav lightbox-next" onClick={onNext} aria-label="Foto successiva">›</button>
      <div className="lightbox-info" aria-live="polite">
        <h3>{photo.title}</h3>
        <p>{metaParts.join(" · ")}</p>
        {currentIndex && totalPhotos && (
          <span className="sr-only">Foto {currentIndex} di {totalPhotos}</span>
        )}
      </div>
    </div>
  );
}

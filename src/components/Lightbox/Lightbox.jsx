import { formatDate } from "../../data/photos";
import "./Lightbox.css";

export default function Lightbox({ photo, onClose, onPrev, onNext }) {
  if (!photo) return null;

  const metaParts = [photo.category, photo.shootingName];
  if (photo.photomodel) metaParts.push(photo.photomodel);
  metaParts.push(formatDate(photo.date));

  return (
    <div className="lightbox active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
      <button className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label="Previous">‹</button>
      <div className="lightbox-content">
        <img src={photo.src} alt={photo.title} />
      </div>
      <button className="lightbox-nav lightbox-next" onClick={onNext} aria-label="Next">›</button>
      <div className="lightbox-info">
        <h3>{photo.title}</h3>
        <p>{metaParts.join(" · ")}</p>
      </div>
    </div>
  );
}

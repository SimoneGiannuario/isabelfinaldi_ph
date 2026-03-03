import { useState, useEffect, useCallback } from "react";
import { PHOTOS } from "../data/photos";

/**
 * useScrollReveal — attaches IntersectionObserver to .reveal elements
 */
export function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

/**
 * useLightbox — manages lightbox open/close state and navigation
 */
export function useLightbox(photos = PHOTOS) {
  const [state, setState] = useState({ open: false, index: 0, photos });

  const open = useCallback((index, filteredPhotos) => {
    setState({ open: true, index, photos: filteredPhotos ?? photos });
    document.body.style.overflow = "hidden";
  }, [photos]);

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    document.body.style.overflow = "";
  }, []);

  const navigate = useCallback((dir) => {
    setState((s) => {
      const len = s.photos.length;
      const next = ((s.index + dir) + len) % len;
      return { ...s, index: next };
    });
  }, []);

  // keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (!state.open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.open, close, navigate]);

  const currentPhoto = state.open ? state.photos[state.index] : null;

  return { ...state, currentPhoto, open, close, navigate };
}

// ---------- Votes (localStorage, one per browser) ----------
const LS_VOTED = "isf_voted_ids";    // Set of voted photo IDs
const LS_COUNTS = "isf_vote_counts";  // {[photoId]: count} overrides

function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export function useVotes() {
  // votedIds: Set of photo IDs the user has already voted
  const [votedIds, setVotedIds] = useState(() => new Set(readLS(LS_VOTED, [])));
  // counts: {[id]: number} — starts from photo default votes, then local increments
  const [counts, setCounts] = useState(() => readLS(LS_COUNTS, {}));

  const hasVoted = (photoId) => votedIds.has(photoId);

  const getCount = (photo) => counts[photo.id] ?? photo.votes;

  const vote = (photo) => {
    if (votedIds.has(photo.id)) return; // already voted

    const newCount = getCount(photo) + 1;

    // Persist voted IDs
    const newVoted = new Set(votedIds);
    newVoted.add(photo.id);
    setVotedIds(newVoted);
    localStorage.setItem(LS_VOTED, JSON.stringify([...newVoted]));

    // Persist updated count
    const newCounts = { ...counts, [photo.id]: newCount };
    setCounts(newCounts);
    localStorage.setItem(LS_COUNTS, JSON.stringify(newCounts));
  };

  return { hasVoted, getCount, vote };
}

// ---------- Photo Protection ----------
/**
 * usePhotoProtection
 * Layers of defence:
 *  1. Blocks contextmenu (right-click) on every <img> → prevents "Save Image As"
 *  2. Prevents native drag on every <img> → prevents drag-to-desktop save
 *  3. Detects PrintScreen key → activates full-page blur guard for ~1.5 s
 *  4. Detects tab visibility loss → blur guard while tab is hidden
 *  5. @media print in CSS hides all images (see index.css)
 *
 * NOTE: OS-level screenshot tools (Snipping Tool after key press) cannot be
 * fully prevented from a browser; the blur guard is the best deterrent available.
 */
export function usePhotoProtection() {
  useEffect(() => {
    // Photo container selector — any click inside these areas is blocked
    const PHOTO_SELECTOR = ".gallery-item, .photo-card, .hero-bg, .about-image, .lightbox";

    // 1 — block right-click on images AND on their container cards
    //     (since images have pointer-events:none, right-clicks land on parent divs)
    const onContextMenu = (e) => {
      const isImg = e.target.tagName === "IMG";
      const isInPhotoArea = !!e.target.closest(PHOTO_SELECTOR);
      if (isImg || isInPhotoArea) e.preventDefault();
    };

    // 2 — block drag on images and their containers
    const onDragStart = (e) => {
      const isImg = e.target.tagName === "IMG";
      const isInPhotoArea = !!e.target.closest(PHOTO_SELECTOR);
      if (isImg || isInPhotoArea) e.preventDefault();
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);

    // Helper: show / hide the full-page blur guard
    const GUARD_CLASS = "screenshot-guard";
    let guardTimer = null;
    const showGuard = (durationMs = 0) => {
      document.body.classList.add(GUARD_CLASS);
      if (durationMs > 0) {
        clearTimeout(guardTimer);
        guardTimer = setTimeout(
          () => document.body.classList.remove(GUARD_CLASS),
          durationMs
        );
      }
    };
    const hideGuard = () => {
      clearTimeout(guardTimer);
      document.body.classList.remove(GUARD_CLASS);
    };

    // 3 — PrintScreen key
    const onKeyDown = (e) => {
      if (e.key === "PrintScreen") {
        e.preventDefault(); // may not work in all browsers but worth trying
        showGuard(1500);
      }
    };
    // 4 — Tab visibility
    const onVisibility = () => {
      if (document.visibilityState === "hidden") showGuard();
      else hideGuard();
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(guardTimer);
      hideGuard();
    };
  }, []);
}


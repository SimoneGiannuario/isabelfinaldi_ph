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

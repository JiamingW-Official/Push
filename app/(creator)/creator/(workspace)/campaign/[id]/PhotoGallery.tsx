"use client";

/* ============================================================
   <PhotoGallery> — Airbnb-style hero collage + lightbox
   v16 · 2026-05-09

   5-tile grid: 1 big left (spans both rows) + 4 small right
   (2x2). "Show all photos" button overlay bottom-right. Click
   any tile → opens fullscreen lightbox with arrow nav.

   If campaign has <5 images we recycle from the available set
   so the layout stays consistent across all campaigns.
   ============================================================ */

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Grid3x3 } from "lucide-react";

export function PhotoGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const safe = images.length > 0 ? images : ["/placeholder.png"];
  const tiles = ensure5(safe);
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="cd-gallery" role="region" aria-label="Photo gallery">
        <button
          type="button"
          className="cd-gallery__tile cd-gallery__tile--hero"
          onClick={() => setLightbox(0)}
          aria-label={`Open photo 1 of ${safe.length}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tiles[0]} alt={`${alt} — view 1`} className="cd-gallery__img" />
        </button>
        {tiles.slice(1, 5).map((src, i) => {
          const idx = i + 1;
          const realIdx = idx < safe.length ? idx : idx % safe.length;
          return (
            <button
              key={`${src}-${i}`}
              type="button"
              className={`cd-gallery__tile cd-gallery__tile--small cd-gallery__tile--pos-${idx}`}
              onClick={() => setLightbox(realIdx)}
              aria-label={`Open photo ${realIdx + 1} of ${safe.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${alt} — view ${idx + 1}`} className="cd-gallery__img" />
            </button>
          );
        })}

        {/* "Show all photos" overlay button — bottom-right of the
            bottom-right tile. Always visible. Airbnb signature. */}
        <button
          type="button"
          className="cd-gallery__all"
          onClick={() => setLightbox(0)}
          aria-label={`Show all ${safe.length} photos`}
        >
          <Grid3x3 size={14} strokeWidth={2} />
          Show all photos
        </button>
      </div>

      {lightbox !== null && (
        <PhotoLightbox
          images={safe}
          startIndex={lightbox}
          alt={alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}

/* ── Lightbox ────────────────────────────────────────────── */

function PhotoLightbox({
  images,
  startIndex,
  alt,
  onClose,
}: {
  images: string[];
  startIndex: number;
  alt: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);
  const next = useCallback(() => {
    setIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  /* Lock body scroll + arrow keys nav + Esc close. */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="cd-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
    >
      {/* Top bar */}
      <div className="cd-lightbox__bar">
        <button
          type="button"
          className="cd-lightbox__close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <span className="cd-lightbox__count">
          {idx + 1} / {images.length}
        </span>
      </div>

      {/* Main image + arrows */}
      <div className="cd-lightbox__main">
        <button
          type="button"
          className="cd-lightbox__arrow cd-lightbox__arrow--prev"
          onClick={prev}
          aria-label="Previous photo"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[idx]}
          alt={`${alt} — view ${idx + 1}`}
          className="cd-lightbox__img"
        />
        <button
          type="button"
          className="cd-lightbox__arrow cd-lightbox__arrow--next"
          onClick={next}
          aria-label="Next photo"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="cd-lightbox__strip">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className={`cd-lightbox__thumb${i === idx ? " is-active" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Jump to photo ${i + 1}`}
              aria-pressed={i === idx}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="cd-lightbox__thumb-img" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

/** Recycle the source array up to 5 entries so the 5-tile layout
 *  always renders. Tile click maps back to the real source index
 *  via modulo so the lightbox shows the actual photo set. */
function ensure5(src: string[]): string[] {
  if (src.length >= 5) return src.slice(0, 5);
  const out: string[] = [];
  for (let i = 0; i < 5; i++) {
    out.push(src[i % src.length] ?? src[0] ?? "");
  }
  return out;
}

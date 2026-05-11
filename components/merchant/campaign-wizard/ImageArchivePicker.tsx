"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Check, ImageIcon, Search } from "lucide-react";
import "./image-archive-picker.css";

/* ── Demo image catalogue ─────────────────────────────────── */
const ARCHIVE_IMAGES = [
  // coffee
  {
    id: "arc-001",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    alt: "Latte art overhead",
    category: "coffee",
    label: "Latte art",
  },
  {
    id: "arc-002",
    src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
    alt: "Espresso pull",
    category: "coffee",
    label: "Espresso shot",
  },
  {
    id: "arc-003",
    src: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    alt: "Cold brew glass",
    category: "coffee",
    label: "Cold brew",
  },
  {
    id: "arc-004",
    src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80",
    alt: "Matcha latte",
    category: "coffee",
    label: "Matcha latte",
  },
  {
    id: "arc-005",
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80",
    alt: "Café interior",
    category: "coffee",
    label: "Café interior",
  },
  {
    id: "arc-006",
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    alt: "Barista at work",
    category: "coffee",
    label: "Barista",
  },
  // bakery
  {
    id: "arc-007",
    src: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80",
    alt: "Bagels on wood board",
    category: "bakery",
    label: "Bagels",
  },
  {
    id: "arc-008",
    src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    alt: "Fresh baked bread",
    category: "bakery",
    label: "Fresh bread",
  },
  {
    id: "arc-009",
    src: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&q=80",
    alt: "Croissants on tray",
    category: "bakery",
    label: "Croissants",
  },
  {
    id: "arc-010",
    src: "https://images.unsplash.com/photo-1567177662154-dfeb4c93b6ae?w=600&q=80",
    alt: "Pastry close-up",
    category: "bakery",
    label: "Pastry",
  },
  {
    id: "arc-011",
    src: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80",
    alt: "Artisan donuts",
    category: "bakery",
    label: "Donuts",
  },
  {
    id: "arc-012",
    src: "https://images.unsplash.com/photo-1515467197853-cd761b5ecf4f?w=600&q=80",
    alt: "Cinnamon rolls",
    category: "bakery",
    label: "Cinnamon rolls",
  },
  // food
  {
    id: "arc-013",
    src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    alt: "Healthy bowl",
    category: "food",
    label: "Grain bowl",
  },
  {
    id: "arc-014",
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    alt: "Colorful plate",
    category: "food",
    label: "Plated dish",
  },
  {
    id: "arc-015",
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    alt: "Fresh salad",
    category: "food",
    label: "Salad",
  },
  {
    id: "arc-016",
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    alt: "Pizza slice",
    category: "food",
    label: "Pizza",
  },
  // lifestyle
  {
    id: "arc-017",
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80",
    alt: "People at table",
    category: "lifestyle",
    label: "Table scene",
  },
  {
    id: "arc-018",
    src: "https://images.unsplash.com/photo-1531925470851-1b5896b62897?w=600&q=80",
    alt: "Cozy café corner",
    category: "lifestyle",
    label: "Café corner",
  },
  {
    id: "arc-019",
    src: "https://images.unsplash.com/photo-1493515322954-4fa727e97985?w=600&q=80",
    alt: "Hands holding drink",
    category: "lifestyle",
    label: "Hands + drink",
  },
  {
    id: "arc-020",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    alt: "Restaurant interior",
    category: "lifestyle",
    label: "Interior",
  },
] as const;

type ImageId = (typeof ARCHIVE_IMAGES)[number]["id"];
type Category = "all" | "coffee" | "bakery" | "food" | "lifestyle";
const CATEGORIES: Category[] = ["all", "coffee", "bakery", "food", "lifestyle"];
const MAX_SELECT = 5;

interface Props {
  open: boolean;
  initialSelected?: string[];
  onClose: () => void;
  onConfirm: (urls: string[]) => void;
}

export function ImageArchivePicker({
  open,
  initialSelected = [],
  onClose,
  onConfirm,
}: Props) {
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<ImageId>>(new Set());

  /* Sync initial selection when modal reopens */
  useEffect(() => {
    if (open) {
      const init = new Set<ImageId>(
        (initialSelected ?? []).filter((id): id is ImageId =>
          ARCHIVE_IMAGES.some((img) => img.id === id),
        ),
      );
      setSelected(init);
      setCategory("all");
      setQuery("");
    }
  }, [open]); // intentionally exclude initialSelected — only sync on open

  const filtered = ARCHIVE_IMAGES.filter((img) => {
    const catMatch = category === "all" || img.category === category;
    const qMatch =
      !query ||
      img.label.toLowerCase().includes(query.toLowerCase()) ||
      img.category.toLowerCase().includes(query.toLowerCase());
    return catMatch && qMatch;
  });

  const toggle = useCallback((id: ImageId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SELECT) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleConfirm = () => {
    const urls = [...selected]
      .map((id) => ARCHIVE_IMAGES.find((img) => img.id === id)?.src ?? "")
      .filter(Boolean);
    onConfirm(urls);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return createPortal(
    <div
      className="iap-overlay"
      role="dialog"
      aria-modal
      aria-label="Image archive"
      onKeyDown={handleKeyDown}
    >
      <div className="iap-backdrop" onClick={onClose} />

      <div className="iap-modal">
        {/* Header */}
        <div className="iap-header">
          <div className="iap-header__left">
            <span className="iap-header__eyebrow">IMAGE ARCHIVE</span>
            <h2 className="iap-header__title">Choose campaign photos</h2>
          </div>
          <button className="iap-close" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Toolbar: search + category filters */}
        <div className="iap-toolbar">
          <div className="iap-search">
            <Search size={14} strokeWidth={2} className="iap-search__icon" />
            <input
              className="iap-search__input"
              placeholder="Search photos…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="iap-cats">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`iap-cat${category === cat ? " iap-cat--active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="iap-grid">
          {filtered.map((img) => {
            const isSelected = selected.has(img.id);
            const isDisabled = !isSelected && selected.size >= MAX_SELECT;
            return (
              <button
                key={img.id}
                className={`iap-tile${isSelected ? " iap-tile--selected" : ""}${isDisabled ? " iap-tile--disabled" : ""}`}
                onClick={() => toggle(img.id)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                aria-label={img.alt}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="iap-tile__img"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="iap-tile__check">
                    <Check size={14} strokeWidth={2.5} />
                  </div>
                )}
                <div className="iap-tile__label">{img.label}</div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="iap-empty">
              <ImageIcon size={28} strokeWidth={1.5} />
              <p>No photos match your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="iap-footer">
          <span className="iap-footer__count">
            {selected.size} / {MAX_SELECT} selected
          </span>
          <div className="iap-footer__actions">
            <button className="iap-btn iap-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="iap-btn iap-btn--primary"
              onClick={handleConfirm}
              disabled={selected.size === 0}
            >
              Apply photos
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

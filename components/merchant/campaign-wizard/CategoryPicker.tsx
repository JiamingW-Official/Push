"use client";

const CATEGORIES = [
  { id: "food", label: "Food", icon: "🍜" },
  { id: "lifestyle", label: "Lifestyle", icon: "✨" },
  { id: "fitness", label: "Fitness", icon: "💪" },
  { id: "coffee", label: "Coffee", icon: "☕" },
  { id: "beauty", label: "Beauty", icon: "💄" },
  { id: "retail", label: "Retail", icon: "🛍️" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

interface CategoryPickerProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function CategoryPicker({
  value,
  onChange,
  error,
}: CategoryPickerProps) {
  return (
    <div>
      <div className="cw-cat-grid">
        {CATEGORIES.map((cat) => {
          const active = value === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={["cw-cat-card", active ? "cw-cat-card--active" : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onChange(cat.id)}
              aria-pressed={active}
            >
              <span className="cw-cat-icon" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="cw-cat-label">{cat.label}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <span className="cw-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

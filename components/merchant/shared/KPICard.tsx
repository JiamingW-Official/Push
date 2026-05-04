import "./kpi-card.css";

export interface KPICardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  variant?: "default" | "accent";
  /**
   * Semantic color override for the KPI numeral.
   * - `default` (omit) → `--ink`
   * - `champagne` → `--champagne` (ceremonial / lifetime totals; respect ≤3-per-viewport rule)
   * - `ink` → forces `--ink` even if `variant="accent"` (rare)
   * Note: `variant="accent"` continues to render Brand Red and stays the recommended
   * way to mark the primary KPI of a page.
   */
  numeralColor?: "default" | "champagne" | "ink";
  delay?: number;
}

export function KPICard({
  label,
  value,
  delta,
  deltaPositive = true,
  variant = "default",
  numeralColor = "default",
  delay,
}: KPICardProps) {
  const deltaClass = delta
    ? deltaPositive
      ? "kpi-card__delta--up"
      : "kpi-card__delta--down"
    : "kpi-card__delta--flat";

  const numeralClasses = [
    "kpi-card__numeral",
    variant === "accent" ? "kpi-card__numeral--primary" : "",
    numeralColor === "champagne" ? "kpi-card__numeral--champagne" : "",
    numeralColor === "ink" ? "kpi-card__numeral--ink" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className="kpi-card"
      tabIndex={0}
      style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}
    >
      <p className="kpi-card__eyebrow">{label}</p>
      <p className={numeralClasses}>{value}</p>
      {delta ? (
        <p className={["kpi-card__delta", deltaClass].join(" ")}>
          <span className="kpi-card__delta-arrow" aria-hidden="true">
            {deltaPositive ? "▲" : "▼"}
          </span>
          {delta}
        </p>
      ) : null}
    </article>
  );
}

/** Oversized editorial stat number with optional delta indicator. */
"use client";

interface BigNumberProps {
  value: number | string;
  label: string;
  delta?: number | string;
  deltaDirection?: "up" | "down" | "neutral";
}

export function BigNumber({
  value,
  label,
  delta,
  deltaDirection = "neutral",
}: BigNumberProps) {
  const deltaColor =
    deltaDirection === "up"
      ? "var(--success-dark)"
      : deltaDirection === "down"
        ? "var(--primary)"
        : "var(--graphite)";

  return (
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "clamp(48px, 8vw, 120px)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
          color: "var(--dark)",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-eyebrow)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--graphite)",
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {label}
        {delta !== undefined && (
          <span
            style={{
              fontWeight: 600,
              fontSize: "var(--text-caption)",
              color: deltaColor,
              letterSpacing: "0.04em",
            }}
          >
            {deltaDirection === "up"
              ? "↑"
              : deltaDirection === "down"
                ? "↓"
                : "·"}{" "}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

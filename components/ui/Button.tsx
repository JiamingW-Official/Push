/** Multi-variant button with loading state, Apple spring transitions, sharp corners. */
"use client";

import React from "react";

type Variant = "fill" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const SPRING = "cubic-bezier(0.32, 0.72, 0, 1)";

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  fill: {
    background: "var(--primary)",
    color: "#ffffff",
    border: "1px solid var(--primary)",
  },
  outline: {
    background: "transparent",
    color: "var(--dark)",
    border: "1px solid var(--dark)",
  },
  "outline-light": {
    background: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.6)",
  },
  ghost: {
    background: "transparent",
    color: "var(--dark)",
    border: "1px solid transparent",
  },
};

const HOVER_STYLES: Record<Variant, React.CSSProperties> = {
  fill: { background: "var(--accent)", borderColor: "var(--accent)" },
  outline: { background: "var(--dark)", color: "#ffffff" },
  "outline-light": {
    background: "rgba(255,255,255,0.12)",
    borderColor: "#ffffff",
  },
  ghost: { background: "var(--surface-muted)" },
};

const SIZE_STYLES: Record<Size, React.CSSProperties> = {
  sm: { fontSize: "11px", padding: "6px 14px", letterSpacing: "0.06em" },
  md: {
    fontSize: "var(--text-eyebrow)",
    padding: "10px 20px",
    letterSpacing: "0.06em",
  },
  lg: {
    fontSize: "var(--text-small)",
    padding: "14px 28px",
    letterSpacing: "0.05em",
  },
};

const Spinner = () => (
  <span
    style={{
      display: "inline-block",
      width: 12,
      height: 12,
      border: "2px solid currentColor",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "btn-spin 0.7s linear infinite",
    }}
  />
);

export function Button({
  variant = "fill",
  size = "md",
  loading = false,
  disabled,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    textTransform: "uppercase",
    borderRadius: 0,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: `all 200ms ${SPRING}`,
    transform: pressed ? "scale(0.97)" : "scale(1)",
    outline: "none",
    textDecoration: "none",
    lineHeight: 1,
    whiteSpace: "nowrap",
    ...VARIANT_STYLES[variant],
    ...(hovered && !disabled && !loading ? HOVER_STYLES[variant] : {}),
    ...SIZE_STYLES[size],
    ...style,
  };

  return (
    <>
      <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        disabled={disabled || loading}
        style={base}
        onMouseEnter={(e) => {
          setHovered(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          setPressed(false);
          onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          setPressed(true);
          onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          setPressed(false);
          onMouseUp?.(e);
        }}
        {...rest}
      >
        {loading ? <Spinner /> : children}
      </button>
    </>
  );
}

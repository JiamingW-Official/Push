/** v11 Unified Button System — Design.md § 9
 *  5 variants: primary | secondary | ink | ghost | pill
 *  + optional editorial (≤1 per page)
 *  CSS classes handle all hover/active/focus — no inline JS hover logic.
 */
"use client";

import React from "react";

export type Variant =
  | "primary"
  | "secondary"
  | "ink"
  | "ghost"
  | "pill"
  | "editorial";

export type Size = "sm" | "md" | "lg";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ink: "btn-ink",
  ghost: "btn-ghost",
  pill: "btn-pill",
  editorial: "btn-editorial",
};

/** Size overrides — applied on top of the CSS class base sizes. */
const SIZE_OVERRIDE: Record<Size, React.CSSProperties> = {
  sm: { padding: "8px 16px", fontSize: 12 },
  md: {},
  lg: { padding: "18px 36px", fontSize: 18 },
};

const Spinner = () => (
  <>
    <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "btn-spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  </>
);

// ---- Props ---------------------------------------------------------------

interface BaseButtonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// Native <button> element
interface ButtonElementProps
  extends
    BaseButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "style"> {
  as?: "button";
}

// Anchor element (e.g. wrapped by next/link)
interface AnchorElementProps
  extends
    BaseButtonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "style"> {
  as: "a";
}

type ButtonProps = ButtonElementProps | AnchorElementProps;

// ---- Component -----------------------------------------------------------

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    className = "",
    children,
    style,
    as: Tag = "button",
    ...rest
  } = props;

  const isButton = Tag === "button";
  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  const disabled = isButton ? buttonRest.disabled || loading : false;

  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(" ");

  const sizeStyle = SIZE_OVERRIDE[size];
  const mergedStyle: React.CSSProperties = {
    ...sizeStyle,
    ...(disabled
      ? { opacity: 0.45, cursor: "not-allowed", transform: "none" }
      : {}),
    ...style,
  };

  if (Tag === "a") {
    const anchorRest = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} style={mergedStyle} {...anchorRest}>
        {loading ? <Spinner /> : children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      style={mergedStyle}
      disabled={disabled}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

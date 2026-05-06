"use client";

/* ============================================================
   Workspace Button System — v11 § 13 (5 + 1 button variants)
   Authority: Design.md § 9 — Filled Primary / Filled Secondary
              / Filled Ink / Ghost / Pill (+ optional Editorial)
   All buttons share the bottom-right hover-shift signature
   (translate(2,2) → translate(3,3) scale(.98)) except where
   explicitly overridden (GA Tri-Color nav).

   Replaces a long tail of bespoke button classes scattered
   across page CSS files (.inv-row-accept, .ib-mark-all-btn,
   .ib-batch-cancel-btn, .inv-row-decline, .inv-row-cancel,
   .inv-row-confirm, .ib-sys-action-btn, etc.) with one
   typed surface every workspace page consumes the same way.
   ============================================================ */

import type { ReactNode, MouseEvent } from "react";
import Link from "next/link";

export type ButtonVariant =
  | "primary" // Brand Red fill — single highest-priority action
  | "secondary" // N2W Blue fill — secondary positive action
  | "ink" // Ink fill — confirm-armed state, dark-surface contexts
  | "ghost" // 1px ink border, transparent — cancel pair
  | "pill" // Surface-3 ground, pill radius — small status / utility
  | "text"; // No background, just color — quiet actions (Cancel)

export type ButtonSize =
  | "sm" //  28px height — toolbar / inline / dense rows
  | "md" //  36px height — default for row actions
  | "lg"; //  44px height — primary CTA blocks

export type ButtonShape =
  | "rounded" // 8px (var(--r-sm)) — Design.md § 9 default for filled
  | "pill"; //  50vh — used in tight row clusters (Accept / Decline / View)

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  /** When true, renders Brand Red (or Ink for the decline variant)
   *  filled with a soft pulsing ring — signals "armed, second tap
   *  commits". Used for two-step Accept / Decline confirmation. */
  confirming?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps & {
  href?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
  ariaPressed?: boolean;
};

type ButtonAsLink = CommonProps & {
  href: string;
  /** External links open in a new tab. */
  external?: boolean;
  ariaLabel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function classes(
  variant: ButtonVariant,
  size: ButtonSize,
  shape: ButtonShape,
  fullWidth: boolean,
  confirming: boolean,
  extra?: string,
): string {
  return [
    "cw-btn",
    `cw-btn--${variant}`,
    `cw-btn--${size}`,
    `cw-btn--${shape}`,
    fullWidth ? "cw-btn--full" : "",
    confirming ? "cw-btn--confirming" : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function Inner({
  iconLeft,
  iconRight,
  children,
}: Pick<CommonProps, "iconLeft" | "iconRight" | "children">) {
  return (
    <>
      {iconLeft && (
        <span className="cw-btn-icon cw-btn-icon--left" aria-hidden>
          {iconLeft}
        </span>
      )}
      <span className="cw-btn-label">{children}</span>
      {iconRight && (
        <span className="cw-btn-icon cw-btn-icon--right" aria-hidden>
          {iconRight}
        </span>
      )}
    </>
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    shape = "rounded",
    iconLeft,
    iconRight,
    fullWidth = false,
    confirming = false,
    className,
    children,
    ariaLabel,
  } = props;

  const cls = classes(variant, size, shape, fullWidth, confirming, className);

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          <Inner iconLeft={iconLeft} iconRight={iconRight}>
            {children}
          </Inner>
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        <Inner iconLeft={iconLeft} iconRight={iconRight}>
          {children}
        </Inner>
      </Link>
    );
  }

  const {
    type = "button",
    disabled = false,
    onClick,
    ariaPressed,
  } = props as ButtonAsButton;

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      <Inner iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </Inner>
    </button>
  );
}

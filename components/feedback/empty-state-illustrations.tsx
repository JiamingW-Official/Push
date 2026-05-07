/**
 * Empty State Illustrations — Push v11 brand line art
 *
 * Single-color line art set for the EmptyState component. Each illustration
 * is inline SVG so it inherits color via `currentColor` (drives `stroke`)
 * and a CSS custom property `--art-accent` for ≤1 secondary highlight.
 *
 * Design constraints (locked, do not deviate per illustration):
 *   - viewBox 200×160 (5:4 aspect, fits naturally above the title)
 *   - Stroke 1.5–2px, round caps + joins, no fills
 *   - Primary stroke = currentColor (Brand Red on default page bg)
 *   - Secondary highlight = var(--art-accent) (Champagne) — ≤1 per art
 *   - 3–5 ambient dots max for texture
 *   - Each tells the page's story in a single glance
 *
 * Sizing + entry animation live in `./empty-state-illustrations.css`.
 */

import "./empty-state-illustrations.css";

export type EmptyStateArtVariant = "default" | "muted";

interface ArtProps {
  /** Optional extra class names appended to `.es-art`. */
  className?: string;
  /** `"muted"` switches to ink-3 / ink-4 + reduced opacity for filter-no-match. */
  variant?: EmptyStateArtVariant;
}

function rootClass(className?: string, variant?: EmptyStateArtVariant): string {
  const base = "es-art";
  const tone = variant === "muted" ? "es-art--muted" : "";
  return [base, tone, className].filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────────────────────────────────
 * 1. NoApplicantsArt — talent pipeline empty
 *    Story: a creator silhouette walking toward a doorway/portal,
 *    question-mark cluster suggests "no creators yet, send out invites".
 * ──────────────────────────────────────────────────────────────────────── */
export function NoApplicantsArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Doorway / portal frame on the right */}
      <path d="M118 44h44v92h-44" />
      <path d="M140 44v92" strokeOpacity="0.35" />
      {/* Walking creator silhouette on the left */}
      <circle cx="58" cy="64" r="10" />
      <path d="M58 74v30" />
      <path d="M58 88l-12 16" />
      <path d="M58 88l12 16" />
      <path d="M58 104l-6 22" />
      <path d="M58 104l8 22" />
      {/* Question-mark cluster (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M92 32c0-4 3-7 7-7s7 3 7 7-7 6-7 12" />
        <circle cx="99" cy="52" r="0.5" fill="currentColor" stroke="none" />
      </g>
      {/* Ambient dots */}
      <circle cx="80" cy="22" r="1" fill="currentColor" stroke="none" />
      <circle cx="118" cy="20" r="1" fill="currentColor" stroke="none" />
      <circle cx="172" cy="36" r="1" fill="currentColor" stroke="none" />
      <circle cx="32" cy="142" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * 2. NoCampaignsArt — empty megaphone with a flag
 *    Story: nothing broadcasting yet → post your first campaign.
 * ──────────────────────────────────────────────────────────────────────── */
export function NoCampaignsArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Megaphone body */}
      <path d="M48 70l68-26v72l-68-26z" />
      {/* Megaphone handle */}
      <path d="M48 70v20" />
      <rect x="40" y="74" width="14" height="12" rx="2" />
      {/* Flagpole + flag (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M132 28v100" />
        <path d="M132 36l28 6-28 6z" />
      </g>
      {/* Sound-wave hints — quiet, ambient dots */}
      <circle cx="156" cy="78" r="1" fill="currentColor" stroke="none" />
      <circle cx="166" cy="74" r="1" fill="currentColor" stroke="none" />
      <circle cx="166" cy="82" r="1" fill="currentColor" stroke="none" />
      <circle cx="28" cy="40" r="1" fill="currentColor" stroke="none" />
      <circle cx="22" cy="118" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * 3. NoQrCodesArt — QR poster outline with corner brackets, no matrix yet
 *    Story: generate first QR code.
 * ──────────────────────────────────────────────────────────────────────── */
export function NoQrCodesArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Poster frame */}
      <rect x="56" y="20" width="88" height="120" rx="4" />
      {/* Top-left QR locator */}
      <rect x="68" y="32" width="20" height="20" rx="2" />
      <rect
        x="74"
        y="38"
        width="8"
        height="8"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
      {/* Top-right QR locator */}
      <rect x="112" y="32" width="20" height="20" rx="2" />
      <rect
        x="118"
        y="38"
        width="8"
        height="8"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
      {/* Bottom-left QR locator */}
      <rect x="68" y="76" width="20" height="20" rx="2" />
      <rect
        x="74"
        y="82"
        width="8"
        height="8"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
      {/* Empty matrix area = single dashed diagonal hint (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M114 78l16 16" strokeDasharray="3 4" />
      </g>
      {/* Caption hairline */}
      <path d="M68 116h64" strokeOpacity="0.45" />
      <path d="M68 124h44" strokeOpacity="0.3" />
      {/* Ambient dots */}
      <circle cx="32" cy="40" r="1" fill="currentColor" stroke="none" />
      <circle cx="170" cy="56" r="1" fill="currentColor" stroke="none" />
      <circle cx="172" cy="120" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * 4. NoLocationsArt — pin marker with dotted compass rays
 *    Story: add your first venue.
 * ──────────────────────────────────────────────────────────────────────── */
export function NoLocationsArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Pin marker body */}
      <path d="M100 28c-14 0-24 10-24 24 0 18 24 44 24 44s24-26 24-44c0-14-10-24-24-24z" />
      {/* Pin inner circle */}
      <circle cx="100" cy="52" r="7" />
      {/* Ground shadow ellipse */}
      <ellipse cx="100" cy="108" rx="14" ry="3" strokeOpacity="0.4" />
      {/* Compass rays (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M40 130l16-6" strokeDasharray="2 4" />
        <path d="M160 130l-16-6" strokeDasharray="2 4" />
        <path d="M100 138v8" strokeDasharray="2 4" />
      </g>
      {/* Ambient dots */}
      <circle cx="32" cy="36" r="1" fill="currentColor" stroke="none" />
      <circle cx="170" cy="44" r="1" fill="currentColor" stroke="none" />
      <circle cx="22" cy="100" r="1" fill="currentColor" stroke="none" />
      <circle cx="178" cy="92" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * 5. NoMessagesArt — paper airplane with motion lines + speech bubble
 *    Story: no conversations yet.
 * ──────────────────────────────────────────────────────────────────────── */
export function NoMessagesArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Paper airplane */}
      <path d="M40 92l108-46-32 86-22-30-26-2 32-32" />
      <path d="M88 100l28-30" strokeOpacity="0.5" />
      {/* Motion lines behind the plane (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M16 70l16 4" strokeDasharray="3 4" />
        <path d="M14 84l20 4" strokeDasharray="3 4" />
        <path d="M18 100l14 2" strokeDasharray="3 4" />
      </g>
      {/* Speech bubble outline */}
      <path d="M132 108h36a4 4 0 014 4v18a4 4 0 01-4 4h-22l-8 8v-8h-6a4 4 0 01-4-4v-18a4 4 0 014-4z" />
      {/* Ambient dots */}
      <circle cx="172" cy="48" r="1" fill="currentColor" stroke="none" />
      <circle cx="48" cy="32" r="1" fill="currentColor" stroke="none" />
      <circle cx="22" cy="138" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * 6. NoTransactionsArt — receipt with three dotted line items
 *    Story: no payments yet.
 * ──────────────────────────────────────────────────────────────────────── */
export function NoTransactionsArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Receipt outline with serrated bottom */}
      <path d="M64 22h72v110l-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6-8-6-8 6z" />
      {/* Header rule */}
      <path d="M72 38h56" />
      {/* Three dotted line items */}
      <path d="M72 56h40" strokeDasharray="2 4" />
      <path d="M120 56h8" />
      <path d="M72 74h36" strokeDasharray="2 4" />
      <path d="M116 74h12" />
      <path d="M72 92h44" strokeDasharray="2 4" />
      <path d="M124 92h4" />
      {/* Total band (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M72 110h56" />
        <path d="M72 118h28" />
      </g>
      {/* Ambient dots */}
      <circle cx="32" cy="40" r="1" fill="currentColor" stroke="none" />
      <circle cx="172" cy="56" r="1" fill="currentColor" stroke="none" />
      <circle cx="170" cy="120" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * 7. NoNotificationsArt — bell silhouette with calm zzz + dots
 *    Story: all caught up.
 * ──────────────────────────────────────────────────────────────────────── */
export function NoNotificationsArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bell body */}
      <path d="M100 36c-16 0-26 12-26 28v22l-8 12h68l-8-12V64c0-16-10-28-26-28z" />
      {/* Bell top knob */}
      <path d="M100 30v6" />
      <circle cx="100" cy="28" r="3" />
      {/* Bell clapper */}
      <path d="M92 110a8 8 0 0016 0" />
      {/* Calm "zzz" stack (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M138 38h12l-12 12h12" />
        <path d="M148 60h10l-10 10h10" />
      </g>
      {/* Ambient dots */}
      <circle cx="38" cy="48" r="1" fill="currentColor" stroke="none" />
      <circle cx="32" cy="100" r="1" fill="currentColor" stroke="none" />
      <circle cx="172" cy="116" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * 8. NoDisputesArt — handshake icon with subtle wave underneath
 *    Story: no disputes — all clean.
 * ──────────────────────────────────────────────────────────────────────── */
export function NoDisputesArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Left forearm + sleeve */}
      <path d="M28 70l24-12 18 10" />
      <path d="M28 70v8l24 12 8-4" />
      {/* Right forearm + sleeve */}
      <path d="M172 70l-24-12-18 10" />
      <path d="M172 70v8l-24 12-8-4" />
      {/* Clasped hands (centered) */}
      <path d="M70 68l24 16 12-2 20-14" />
      <path d="M82 76l16 12" />
      <path d="M98 82l14-2" />
      {/* Calm wave underneath (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M40 124c12-8 20-8 32 0s20 8 32 0 20-8 32 0 20 8 24 4" />
      </g>
      {/* Ambient dots */}
      <circle cx="32" cy="40" r="1" fill="currentColor" stroke="none" />
      <circle cx="172" cy="36" r="1" fill="currentColor" stroke="none" />
      <circle cx="100" cy="22" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * BONUS — search / filter no-match generic art
 * ──────────────────────────────────────────────────────────────────────── */

export function NoSearchResultsArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Telescope barrel */}
      <path d="M58 96l44-58 18 12-44 58z" />
      {/* Telescope eyepiece */}
      <path d="M52 102l16 12" />
      <path d="M48 108l16 12" />
      {/* Tripod */}
      <path d="M88 110l-22 32" />
      <path d="M104 122l4 24" />
      <path d="M110 116l16 24" />
      {/* Star + question (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M148 36l4 8 8 2-6 6 2 8-8-4-8 4 2-8-6-6 8-2z" />
        <path d="M170 60c0-3 2-5 5-5s5 2 5 5-5 4-5 8" />
        <circle cx="175" cy="74" r="0.5" fill="currentColor" stroke="none" />
      </g>
      {/* Ambient dots */}
      <circle cx="28" cy="44" r="1" fill="currentColor" stroke="none" />
      <circle cx="180" cy="98" r="1" fill="currentColor" stroke="none" />
      <circle cx="40" cy="140" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function NoFilterMatchArt({ className, variant }: ArtProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={rootClass(className, variant)}
      aria-hidden="true"
      role="img"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Magnifying glass */}
      <circle cx="86" cy="74" r="36" />
      <path d="M114 102l28 28" />
      <path d="M138 126l8 8" strokeWidth="3" />
      {/* "?" inside lens (champagne accent) */}
      <g style={{ color: "var(--art-accent)" }} stroke="currentColor">
        <path d="M78 64c0-5 4-8 8-8s8 3 8 8-8 6-8 12" />
        <circle cx="86" cy="86" r="1" fill="currentColor" stroke="none" />
      </g>
      {/* Ambient dots */}
      <circle cx="32" cy="36" r="1" fill="currentColor" stroke="none" />
      <circle cx="170" cy="44" r="1" fill="currentColor" stroke="none" />
      <circle cx="40" cy="138" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Strongly-typed kind→component map for EmptyState's `artKind` prop.
 * ──────────────────────────────────────────────────────────────────────── */
export const EMPTY_STATE_ART = {
  applicants: NoApplicantsArt,
  campaigns: NoCampaignsArt,
  qrcodes: NoQrCodesArt,
  locations: NoLocationsArt,
  messages: NoMessagesArt,
  transactions: NoTransactionsArt,
  notifications: NoNotificationsArt,
  disputes: NoDisputesArt,
  search: NoSearchResultsArt,
  filter: NoFilterMatchArt,
} as const;

export type EmptyStateArtKind = keyof typeof EMPTY_STATE_ART;

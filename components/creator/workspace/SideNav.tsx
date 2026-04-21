"use client";

// Push Creator Workspace — SideNav (Simplified)
// Design.md: 240px width, --surface bg, 8px grid
// Active = 3px Flag Red left border + text darkens, no bg highlight
// Structure: 5 primary + divider + 2 secondary + footer user row

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEMO_CREATOR } from "@/lib/creator/demo-data";
import "./workspace.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PrimaryNavItem {
  label: string;
  href: string;
  icon: string;
  /** Match by prefix or exact */
  exact?: boolean;
}

interface SecondaryNavItem {
  label: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Icon map — geometric Unicode glyphs, no external lib
// ---------------------------------------------------------------------------

const ICONS: Record<string, string> = {
  home: "⬡",
  work: "◈",
  discover: "◐",
  inbox: "▣",
  earnings: "▲",
  profile: "○",
  settings: "◍",
  logout: "◁",
};

// ---------------------------------------------------------------------------
// Primary nav items (icon + label, full weight)
// ---------------------------------------------------------------------------

const PRIMARY_ITEMS: PrimaryNavItem[] = [
  { label: "Home", href: "/creator/dashboard", icon: ICONS.home, exact: true },
  { label: "Work", href: "/creator/work/today", icon: ICONS.work },
  { label: "Discover", href: "/creator/discover", icon: ICONS.discover },
  { label: "Inbox", href: "/creator/inbox", icon: ICONS.inbox },
  {
    label: "Earnings",
    href: "/creator/portfolio/earnings",
    icon: ICONS.earnings,
  },
  // v5.3-EXEC orphan rescue: these existed as pages but had no nav entry.
  { label: "Analytics", href: "/creator/analytics", icon: "◉" },
  { label: "Leaderboard", href: "/creator/leaderboard", icon: "★" },
];

// ---------------------------------------------------------------------------
// Secondary nav items (no icon, smaller, lower visual weight)
// ---------------------------------------------------------------------------

const SECONDARY_ITEMS: SecondaryNavItem[] = [
  { label: "Profile", href: "/creator/portfolio/identity" },
  { label: "Portfolio", href: "/creator/portfolio" },
  { label: "Notifications", href: "/creator/notifications" },
  { label: "Wallet", href: "/creator/wallet" },
  { label: "Settings", href: "/creator/settings" },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SideNavProps {
  /** Dynamic badge counts — key = href */
  badges?: Record<string, number>;
  /** Creator display name */
  userName?: string;
  /** Creator tier lowercase */
  tier?: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** When rendered as overlay, call this to close it */
  onClose?: () => void;
}

// ---------------------------------------------------------------------------
// Tier helpers
// ---------------------------------------------------------------------------

const TIER_COLORS: Record<string, string> = {
  seed: "#b8a99a",
  explorer: "#669bbc",
  operator: "#2d6a4f",
  proven: "#3a4fd8",
  closer: "#c9a96e",
  partner: "#c1121f",
  // legacy aliases
  clay: "#b8a99a",
  bronze: "#c9a96e",
  steel: "#669bbc",
  gold: "#d4a017",
  ruby: "#c1121f",
  obsidian: "#003049",
};

function tierLabel(tier: string): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SideNav({
  badges = {},
  userName,
  tier,
  avatarUrl,
  onClose,
}: SideNavProps) {
  const pathname = usePathname();

  const displayName = userName ?? DEMO_CREATOR.name;
  const displayTier = tier ?? DEMO_CREATOR.tier;
  const tierKey = displayTier.toLowerCase();
  const tierColor = TIER_COLORS[tierKey] ?? TIER_COLORS.seed;
  const initial = displayName.charAt(0).toUpperCase();

  // Active match: exact for dashboard, prefix for everything else
  const isActive = (href: string, exact?: boolean): boolean => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="ws-sidenav" aria-label="Main navigation">
      {/* ── Overlay close button (only in overlay mode) ── */}
      {onClose && (
        <div className="ws-sidenav__overlay-header">
          <span className="ws-sidenav__overlay-title">PUSH</span>
          <button
            className="ws-sidenav__close-btn"
            onClick={onClose}
            aria-label="Close navigation"
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Primary nav items ── */}
      <div className="ws-sidenav__scroll">
        <div className="ws-sidenav__primary">
          {PRIMARY_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            const badgeCount = badges[item.href];
            const showBadge = badgeCount !== undefined && badgeCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ws-sidenav__item${active ? " ws-sidenav__item--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="ws-sidenav__item-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="ws-sidenav__item-label">{item.label}</span>
                {showBadge && (
                  <span
                    className="ws-sidenav__badge ws-sidenav__badge--alert"
                    aria-label={`${badgeCount} unread`}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Divider ── */}
        <div className="ws-sidenav__divider" aria-hidden="true" />

        {/* ── Secondary nav items (no icon) ── */}
        <div className="ws-sidenav__secondary">
          {SECONDARY_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ws-sidenav__sec-item${active ? " ws-sidenav__sec-item--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Footer: user identity row ── */}
      <div className="ws-sidenav__footer">
        <Link
          href="/creator/portfolio/identity"
          className="ws-sidenav__user"
          aria-label={`Profile — ${displayName} (${tierLabel(tierKey)})`}
        >
          <div className="ws-sidenav__user-avatar" aria-hidden="true">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="ws-sidenav__user-avatar-img"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="ws-sidenav__user-initial">{initial}</span>
            )}
          </div>
          <div className="ws-sidenav__user-info">
            <span className="ws-sidenav__user-name">{displayName}</span>
            <span
              className="ws-sidenav__user-tier"
              style={{ color: tierColor }}
            >
              {tierLabel(tierKey)}
            </span>
          </div>
          <span className="ws-sidenav__user-arrow" aria-hidden="true">
            ›
          </span>
        </Link>

        <div className="ws-sidenav__footer-actions">
          <Link
            href="/creator/login"
            className="ws-sidenav__footer-action ws-sidenav__footer-action--logout"
            aria-label="Sign out"
          >
            <span className="ws-sidenav__item-icon" aria-hidden="true">
              {ICONS.logout}
            </span>
            <span>Sign out</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

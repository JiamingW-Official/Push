"use client";

// Push Creator Workspace — SideNav v3
// Design.md §1: 240px width, var(--surface-2) bg, 8px grid
// Active = 3px brand-red left border, brand-red-tint bg, no per-page custom
// Structure: 3 labeled sections (DAILY / MONEY / COMMUNITY) + Account links + user row
// Wallet → merged into Earnings. Portfolio → merged into Profile.
// Notifications → TopNav bell badge only. No standalone nav entries.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEMO_CREATOR } from "@/lib/creator/demo-data";
import "./workspace.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

// ---------------------------------------------------------------------------
// Navigation structure — 3 sections, 7 primary entries total
// ---------------------------------------------------------------------------

const NAV_SECTIONS: NavSection[] = [
  {
    id: "daily",
    label: "DAILY",
    items: [
      { label: "Home",     href: "/creator/dashboard", icon: "◐", exact: true },
      { label: "Work",     href: "/creator/work/today", icon: "◈" },
      { label: "Discover", href: "/creator/discover",   icon: "○" },
    ],
  },
  {
    id: "money",
    label: "MONEY",
    items: [
      { label: "Earnings",  href: "/creator/earnings",  icon: "▲" },
      { label: "Analytics", href: "/creator/analytics", icon: "◉" },
    ],
  },
  {
    id: "community",
    label: "COMMUNITY",
    items: [
      { label: "Inbox",       href: "/creator/inbox",       icon: "▣" },
      { label: "Leaderboard", href: "/creator/leaderboard", icon: "★" },
    ],
  },
];

// Account links — small text below divider (no icon, lower visual weight)
const ACCOUNT_ITEMS = [
  { label: "Profile & Portfolio", href: "/creator/profile" },
  { label: "Settings",            href: "/creator/settings" },
];

// ---------------------------------------------------------------------------
// Tier color map — from Design.md Tier v7 re-map
// ---------------------------------------------------------------------------

const TIER_COLORS: Record<string, string> = {
  seed:     "#b8a99a",   // Clay
  explorer: "#669bbc",   // Steel
  operator: "#2d6a4f",   // Forest
  proven:   "#3a4fd8",   // Cobalt
  closer:   "#c9a96e",   // Bronze/Champagne
  partner:  "#c1121f",   // Brand Red
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SideNavProps {
  badges?:    Record<string, number>;
  userName?:  string;
  tier?:      string;
  avatarUrl?: string;
  onClose?:   () => void;
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
  const displayTier = tier  ?? DEMO_CREATOR.tier;
  const tierKey     = displayTier.toLowerCase();
  const tierColor   = TIER_COLORS[tierKey] ?? TIER_COLORS.seed;
  const initial     = displayName.charAt(0).toUpperCase();
  const tierLabel   = tierKey.charAt(0).toUpperCase() + tierKey.slice(1);

  const isActive = (href: string, exact?: boolean): boolean =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="ws-sidenav" aria-label="Main navigation">

      {/* ── Overlay close header (mobile only) ─────────────────── */}
      {onClose && (
        <div className="ws-sidenav__overlay-header">
          <span className="ws-sidenav__overlay-title">PUSH</span>
          <button
            className="ws-sidenav__close-btn"
            onClick={onClose}
            type="button"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Scrollable nav area ─────────────────────────────────── */}
      <div className="ws-sidenav__scroll">

        {/* ── 3 labeled sections ──────────────────────────────── */}
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="ws-sidenav__section">
            <span className="ws-sidenav__section-label" aria-hidden="true">
              {section.label}
            </span>

            {section.items.map((item) => {
              const active     = isActive(item.href, item.exact);
              const badgeCount = badges[item.href];
              const showBadge  = typeof badgeCount === "number" && badgeCount > 0;

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
        ))}

        {/* ── Divider ─────────────────────────────────────────── */}
        <div className="ws-sidenav__divider" aria-hidden="true" />

        {/* ── Account links (small, lower weight) ─────────────── */}
        <div className="ws-sidenav__account" role="group" aria-label="Account">
          {ACCOUNT_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`ws-sidenav__account-item${
                pathname.startsWith(item.href)
                  ? " ws-sidenav__account-item--active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer: user identity row ────────────────────────── */}
      <div className="ws-sidenav__footer">
        <Link
          href="/creator/profile"
          className="ws-sidenav__user"
          aria-label={`Profile — ${displayName} (${tierLabel})`}
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
            <span className="ws-sidenav__user-tier" style={{ color: tierColor }}>
              {tierLabel}
            </span>
          </div>
          <span className="ws-sidenav__user-arrow" aria-hidden="true">›</span>
        </Link>
      </div>
    </nav>
  );
}

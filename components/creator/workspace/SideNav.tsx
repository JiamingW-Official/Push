"use client";

// Push Creator Workspace — SideNav  (Wave 2)
// Design.md: 240px width, --surface bg, 8px grid
// Active = 3px Flag Red left border (animated) + subtle bg tint
// Fonts: CSGenioMono (body/UI)

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./workspace.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number | null;
  badgeVariant?: "default" | "alert";
}

interface NavSection {
  id: string;
  /** null = no eyebrow header (standalone section) */
  title: string | null;
  items: NavItem[];
}

// ---------------------------------------------------------------------------
// Icon map — geometric Unicode glyphs, no external lib
// ---------------------------------------------------------------------------

const ICONS: Record<string, string> = {
  today: "◈",
  pipeline: "◇",
  calendar: "◻",
  drafts: "◎",
  identity: "◉",
  earnings: "▲",
  archive: "▷",
  messages: "▣",
  invites: "◆",
  system: "◌",
  discover: "◐",
  profile: "○",
  settings: "◍",
};

// ---------------------------------------------------------------------------
// Static nav structure
// ---------------------------------------------------------------------------

const NAV_SECTIONS: NavSection[] = [
  {
    id: "work",
    title: "WORK",
    items: [
      { label: "Today", href: "/creator/dashboard", icon: ICONS.today },
      { label: "Pipeline", href: "/creator/campaigns", icon: ICONS.pipeline },
      { label: "Calendar", href: "/creator/calendar", icon: ICONS.calendar },
      { label: "Drafts", href: "/creator/drafts", icon: ICONS.drafts },
    ],
  },
  {
    id: "inbox",
    title: "INBOX",
    items: [
      { label: "Messages", href: "/creator/messages", icon: ICONS.messages },
      {
        label: "Invites",
        href: "/creator/notifications",
        icon: ICONS.invites,
        badgeVariant: "alert",
      },
    ],
  },
  {
    id: "portfolio",
    title: "PORTFOLIO",
    items: [
      { label: "Identity", href: "/creator/portfolio", icon: ICONS.identity },
      { label: "Earnings", href: "/creator/earnings", icon: ICONS.earnings },
      { label: "Archive", href: "/creator/archive", icon: ICONS.archive },
    ],
  },
  {
    id: "discover",
    title: null, // standalone — rendered with top separator via CSS
    items: [
      { label: "Discover", href: "/creator/explore", icon: ICONS.discover },
    ],
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SideNavProps {
  /** Dynamic badge counts — key = href */
  badges?: Record<string, number>;
  /** Creator display name */
  userName?: string;
  /** Creator tier (lowercase) */
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
// NavLink sub-component
// ---------------------------------------------------------------------------

function NavLink({
  item,
  isActive,
  badgeCount,
}: {
  item: NavItem;
  isActive: boolean;
  badgeCount?: number;
}) {
  const showBadge = badgeCount !== undefined && badgeCount > 0;

  return (
    <Link
      href={item.href}
      className={`ws-sidenav__item${isActive ? " ws-sidenav__item--active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="ws-sidenav__item-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="ws-sidenav__item-label">{item.label}</span>
      {showBadge && (
        <span
          className={`ws-sidenav__badge${
            item.badgeVariant === "alert" ? " ws-sidenav__badge--alert" : ""
          }`}
          aria-label={`${badgeCount} unread`}
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SideNav({
  badges = {},
  userName = "Creator",
  tier = "seed",
  avatarUrl,
  onClose,
}: SideNavProps) {
  const pathname = usePathname();
  const tierKey = tier.toLowerCase();
  const tierColor = TIER_COLORS[tierKey] ?? TIER_COLORS.seed;
  const initial = userName.charAt(0).toUpperCase();

  // Active match: exact for dashboard, prefix for everything else
  const isActive = (href: string) => {
    if (href === "/creator/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="ws-sidenav" aria-label="Creator workspace navigation">
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

      {/* ── Scrollable nav sections ── */}
      <div className="ws-sidenav__scroll">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="ws-sidenav__section">
            {section.title && (
              <div className="ws-sidenav__section-header" aria-hidden="true">
                {section.title}
              </div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
                badgeCount={badges[item.href]}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── Footer: user identity ── */}
      <div className="ws-sidenav__footer">
        <Link
          href="/creator/profile"
          className="ws-sidenav__user"
          aria-label={`Profile — ${userName} (${tierLabel(tierKey)})`}
        >
          <div className="ws-sidenav__user-avatar" aria-hidden="true">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={userName}
                className="ws-sidenav__user-avatar-img"
              />
            ) : (
              <span className="ws-sidenav__user-initial">{initial}</span>
            )}
          </div>
          <div className="ws-sidenav__user-info">
            <span className="ws-sidenav__user-name">{userName}</span>
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
      </div>
    </nav>
  );
}

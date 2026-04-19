"use client";

// Push Creator Workspace — SideNav  (Wave 4 Polish)
// Design.md: 240px width, --surface bg, 8px grid
// Active = 3px Flag Red left border (animated) + subtle bg tint
// Fonts: CSGenioMono (body/UI)

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DEMO_CREATOR } from "@/lib/creator/demo-data";
import "./workspace.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  icon: string;
  /** Static badge variant (alert = red) */
  badgeVariant?: "default" | "alert";
}

interface NavSection {
  id: string;
  /** null = no eyebrow header (standalone section) */
  title: string | null;
  items: NavItem[];
  /** Whether this section supports collapse */
  collapsible?: boolean;
}

// ---------------------------------------------------------------------------
// Icon map — geometric Unicode glyphs, no external lib
// ---------------------------------------------------------------------------

const ICONS: Record<string, string> = {
  home: "⬡",
  today: "◈",
  pipeline: "◇",
  calendar: "◻",
  drafts: "◎",
  inbox: "▣",
  invites: "◆",
  messages: "▸",
  system: "◌",
  discover: "◐",
  identity: "◉",
  earnings: "▲",
  archive: "▷",
  wallet: "◎",
  profile: "○",
  settings: "◍",
  logout: "◁",
};

// ---------------------------------------------------------------------------
// Nav structure — aligned to actual file-system routes
// ---------------------------------------------------------------------------

const NAV_SECTIONS: NavSection[] = [
  {
    // Dashboard — standalone, no section header
    id: "home",
    title: null,
    collapsible: false,
    items: [
      { label: "Dashboard", href: "/creator/dashboard", icon: ICONS.home },
    ],
  },
  {
    id: "work",
    title: "WORK",
    collapsible: true,
    items: [
      { label: "Today", href: "/creator/work/today", icon: ICONS.today },
      {
        label: "Pipeline",
        href: "/creator/work/pipeline",
        icon: ICONS.pipeline,
      },
      {
        label: "Calendar",
        href: "/creator/work/calendar",
        icon: ICONS.calendar,
      },
      { label: "Drafts", href: "/creator/work/drafts", icon: ICONS.drafts },
    ],
  },
  {
    id: "discover",
    title: null,
    collapsible: false,
    items: [
      { label: "Discover", href: "/creator/discover", icon: ICONS.discover },
    ],
  },
  {
    id: "inbox",
    title: "INBOX",
    collapsible: true,
    items: [
      { label: "All", href: "/creator/inbox", icon: ICONS.inbox },
      {
        label: "Invites",
        href: "/creator/inbox/invites",
        icon: ICONS.invites,
        badgeVariant: "alert",
      },
      {
        label: "Messages",
        href: "/creator/inbox/messages",
        icon: ICONS.messages,
      },
      { label: "System", href: "/creator/inbox/system", icon: ICONS.system },
    ],
  },
  {
    id: "portfolio",
    title: "PORTFOLIO",
    collapsible: true,
    items: [
      {
        label: "Identity",
        href: "/creator/portfolio/identity",
        icon: ICONS.identity,
      },
      {
        label: "Earnings",
        href: "/creator/portfolio/earnings",
        icon: ICONS.earnings,
      },
      {
        label: "Archive",
        href: "/creator/portfolio/archive",
        icon: ICONS.archive,
      },
      {
        label: "Wallet",
        href: "/creator/wallet",
        icon: ICONS.wallet,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SideNavProps {
  /** Dynamic badge counts — key = href */
  badges?: Record<string, number>;
  /** Creator display name (falls back to DEMO_CREATOR) */
  userName?: string;
  /** Creator tier lowercase (falls back to DEMO_CREATOR) */
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
// CollapsibleSection sub-component
// ---------------------------------------------------------------------------

function CollapsibleSection({
  section,
  isExpanded,
  isSectionActive,
  onToggle,
  badges,
  isActive,
}: {
  section: NavSection;
  isExpanded: boolean;
  isSectionActive: boolean;
  onToggle: () => void;
  badges: Record<string, number>;
  isActive: (href: string) => boolean;
}) {
  return (
    <div
      className={`ws-sidenav__section${isSectionActive ? " ws-sidenav__section--active" : ""}`}
    >
      {section.title && (
        <button
          className={`ws-sidenav__section-header ws-sidenav__section-header--btn${
            isSectionActive ? " ws-sidenav__section-header--active" : ""
          }`}
          onClick={onToggle}
          aria-expanded={isExpanded}
          type="button"
        >
          <span>{section.title}</span>
          <span
            className={`ws-sidenav__section-chevron${isExpanded ? " ws-sidenav__section-chevron--open" : ""}`}
            aria-hidden="true"
          >
            ›
          </span>
        </button>
      )}
      <div
        className={`ws-sidenav__section-items${isExpanded ? " ws-sidenav__section-items--open" : ""}`}
        aria-hidden={!isExpanded}
      >
        {/* Inner wrapper required for grid-template-rows collapse trick */}
        <div>
          {section.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              badgeCount={badges[item.href]}
            />
          ))}
        </div>
      </div>
    </div>
  );
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

  // Fall back to DEMO_CREATOR values
  const displayName = userName ?? DEMO_CREATOR.name;
  const displayTier = tier ?? DEMO_CREATOR.tier;
  const tierKey = displayTier.toLowerCase();
  const tierColor = TIER_COLORS[tierKey] ?? TIER_COLORS.seed;
  const initial = displayName.charAt(0).toUpperCase();

  // Collapsible state — all sections start expanded
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const isExpanded = (sectionId: string) => !collapsed[sectionId];

  const toggleSection = (sectionId: string) => {
    setCollapsed((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Active match: exact for dashboard, prefix for everything else
  const isActive = (href: string): boolean => {
    if (href === "/creator/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  // Section is active if any child item is active
  const isSectionActive = (section: NavSection): boolean =>
    section.items.some((item) => isActive(item.href));

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

      {/* ── Scrollable nav sections ── */}
      <div className="ws-sidenav__scroll">
        {NAV_SECTIONS.map((section) => {
          const sectionActive = isSectionActive(section);

          // Standalone section (no title, no collapse) — Dashboard, Discover
          if (!section.collapsible || !section.title) {
            return (
              <div
                key={section.id}
                className={`ws-sidenav__section${sectionActive ? " ws-sidenav__section--active" : ""}`}
              >
                {section.title && (
                  <div
                    className={`ws-sidenav__section-header${sectionActive ? " ws-sidenav__section-header--active" : ""}`}
                    aria-hidden="true"
                  >
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
            );
          }

          // Collapsible section
          return (
            <CollapsibleSection
              key={section.id}
              section={section}
              isExpanded={isExpanded(section.id)}
              isSectionActive={sectionActive}
              onToggle={() => toggleSection(section.id)}
              badges={badges}
              isActive={isActive}
            />
          );
        })}
      </div>

      {/* ── Footer: user identity + settings ── */}
      <div className="ws-sidenav__footer">
        {/* User profile row */}
        <Link
          href="/creator/profile"
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

        {/* Settings + Logout */}
        <div className="ws-sidenav__footer-actions">
          <Link
            href="/creator/settings"
            className={`ws-sidenav__footer-action${pathname.startsWith("/creator/settings") ? " ws-sidenav__footer-action--active" : ""}`}
            aria-label="Settings"
          >
            <span className="ws-sidenav__item-icon" aria-hidden="true">
              {ICONS.settings}
            </span>
            <span>Settings</span>
          </Link>
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

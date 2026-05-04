"use client";

// Push Creator Workspace — TopNav  (Wave 3)
// Design.md: 56px height, --surface-elevated bg, 1px --line bottom border, sticky z-100
// Colors: --primary #c1121f, --dark #003049, --surface, --line
// Fonts: Darky (display/logo), CSGenioMono (body/UI)

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCommandK } from "@/components/search/CommandKProvider";
import "./workspace.css";

// ---------------------------------------------------------------------------
// Tier badge config
// ---------------------------------------------------------------------------

const TIER_BADGE_STYLES: Record<
  string,
  { bg: string; color: string; border: string; label: string }
> = {
  seed: { bg: "#f7f5f3", color: "#b8a99a", border: "#b8a99a", label: "Seed" },
  explorer: {
    bg: "#eef4f8",
    color: "#669bbc",
    border: "#669bbc",
    label: "Explorer",
  },
  operator: {
    bg: "#eef3ee",
    color: "#2d6a4f",
    border: "#2d6a4f",
    label: "Operator",
  },
  proven: {
    bg: "#f0f4ff",
    color: "#3a4fd8",
    border: "#3a4fd8",
    label: "Proven",
  },
  closer: {
    bg: "#fff4e5",
    color: "#c9a96e",
    border: "#c9a96e",
    label: "Closer",
  },
  partner: {
    bg: "#fdf0f0",
    color: "#c1121f",
    border: "#c1121f",
    label: "Partner",
  },
};

// ---------------------------------------------------------------------------
// Breadcrumb config — maps pathname to section + page labels
// ---------------------------------------------------------------------------

interface BreadcrumbConfig {
  section: string;
  sectionHref: string;
  page?: string;
  /** document.title prefix */
  title: string;
}

function getBreadcrumb(pathname: string): BreadcrumbConfig {
  if (pathname.startsWith("/creator/work/today"))
    return {
      section: "Work",
      sectionHref: "/creator/work/today",
      page: "Today",
      title: "Today",
    };
  if (pathname.startsWith("/creator/work/pipeline"))
    return {
      section: "Work",
      sectionHref: "/creator/work/today",
      page: "Pipeline",
      title: "Pipeline",
    };
  if (pathname.startsWith("/creator/work/calendar"))
    return {
      section: "Work",
      sectionHref: "/creator/work/today",
      page: "Calendar",
      title: "Calendar",
    };
  if (pathname.startsWith("/creator/work/drafts"))
    return {
      section: "Work",
      sectionHref: "/creator/work/today",
      page: "Drafts",
      title: "Drafts",
    };
  if (pathname.startsWith("/creator/discover"))
    return {
      section: "Discover",
      sectionHref: "/creator/discover",
      title: "Discover",
    };
  if (pathname.startsWith("/creator/inbox/invites"))
    return {
      section: "Inbox",
      sectionHref: "/creator/inbox",
      page: "Invites",
      title: "Invites",
    };
  if (pathname.startsWith("/creator/inbox/messages"))
    return {
      section: "Inbox",
      sectionHref: "/creator/inbox",
      page: "Messages",
      title: "Messages",
    };
  if (pathname.startsWith("/creator/inbox"))
    return { section: "Inbox", sectionHref: "/creator/inbox", title: "Inbox" };
  if (pathname.startsWith("/creator/portfolio/earnings"))
    return {
      section: "Portfolio",
      sectionHref: "/creator/portfolio",
      page: "Earnings",
      title: "Earnings",
    };
  if (pathname.startsWith("/creator/portfolio/archive"))
    return {
      section: "Portfolio",
      sectionHref: "/creator/portfolio",
      page: "Archive",
      title: "Archive",
    };
  if (pathname.startsWith("/creator/portfolio/identity"))
    return {
      section: "Portfolio",
      sectionHref: "/creator/portfolio",
      page: "Identity",
      title: "Identity",
    };
  if (pathname.startsWith("/creator/portfolio"))
    return {
      section: "Portfolio",
      sectionHref: "/creator/portfolio",
      title: "Portfolio",
    };
  // Fallback
  return {
    section: "Dashboard",
    sectionHref: "/creator/dashboard",
    title: "Dashboard",
  };
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TopNavProps {
  /** Current page display name (legacy — overridden by pathname breadcrumb) */
  pageName?: string;
  /** Creator's current tier key (lowercase) */
  tier?: string;
  /** Creator display name (for avatar initial) */
  userName?: string;
  /** Unread notification count */
  notifCount?: number;
  /** Avatar image URL — if absent, shows initial avatar */
  avatarUrl?: string;
  /** Called when hamburger menu button is clicked (tablet/mobile) */
  onMenuClick?: () => void;
}

// ---------------------------------------------------------------------------
// Icons (inline SVG — no external dep)
// ---------------------------------------------------------------------------

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="square"
        strokeLinejoin="miter"
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.2}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6" />
      <path strokeLinecap="square" d="M21 21l-4.35-4.35" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TopNav({
  pageName = "Dashboard",
  tier = "seed",
  userName = "Creator",
  notifCount = 0,
  avatarUrl,
  onMenuClick,
}: TopNavProps) {
  const { open: openSearch } = useCommandK();
  const pathname = usePathname();
  const tierKey = tier.toLowerCase();
  const tierStyle = TIER_BADGE_STYLES[tierKey] ?? TIER_BADGE_STYLES.seed;
  const initial = userName.charAt(0).toUpperCase();
  const clampedNotif = Math.min(notifCount, 99);

  // Derive breadcrumb from current pathname
  const crumb = getBreadcrumb(pathname ?? "");

  // Update document title on navigation
  useEffect(() => {
    document.title = `${crumb.title} — Push Creator`;
  }, [crumb.title]);

  return (
    <header className="ws-topnav" role="banner">
      {/* ── Left: Hamburger (tablet/mobile) + Logo + Breadcrumb ── */}
      <div className="ws-topnav__left">
        {/* Hamburger — visible on tablet (≤1024px), hidden on desktop */}
        <button
          className="ws-topnav__hamburger"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          type="button"
          aria-haspopup="dialog"
        >
          <span className="ws-topnav__hamburger-bar" aria-hidden="true" />
          <span className="ws-topnav__hamburger-bar" aria-hidden="true" />
          <span className="ws-topnav__hamburger-bar" aria-hidden="true" />
        </button>

        <Link
          href="/creator/dashboard"
          className="ws-topnav__logo"
          aria-label="Push Dashboard"
        >
          PUSH
        </Link>
        <span className="ws-topnav__sep" aria-hidden="true">
          /
        </span>

        {/* Breadcrumb: section (clickable) + optional page */}
        <nav className="ws-topnav__breadcrumb" aria-label="Breadcrumb">
          <Link
            href={crumb.sectionHref}
            className={`ws-topnav__bc-section${!crumb.page ? " ws-topnav__bc-section--active" : ""}`}
          >
            {crumb.section}
          </Link>
          {crumb.page && (
            <>
              <span className="ws-topnav__bc-sep" aria-hidden="true">
                /
              </span>
              <span className="ws-topnav__bc-page">{crumb.page}</span>
            </>
          )}
        </nav>
      </div>

      {/* ── Center: Global Search trigger ── */}
      <div className="ws-topnav__center">
        <button
          className="ws-topnav__search"
          onClick={openSearch}
          aria-label="Open search (Cmd+K)"
          type="button"
        >
          <span className="ws-topnav__search-icon">
            <SearchIcon />
          </span>
          <span className="ws-topnav__search-placeholder">
            Search everything…
          </span>
          <span className="ws-topnav__search-kbd" aria-hidden="true">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </span>
        </button>
      </div>

      {/* ── Right: Tier + Notif + Avatar ── */}
      <div className="ws-topnav__right">
        {/* Tier badge */}
        <span
          className="ws-topnav__tier"
          style={{
            background: tierStyle.bg,
            color: tierStyle.color,
            borderColor: tierStyle.border,
          }}
          aria-label={`Tier: ${tierStyle.label}`}
          title={`Creator tier: ${tierStyle.label}`}
        >
          {tierStyle.label}
        </span>

        {/* Notification bell */}
        <Link
          href="/creator/notifications"
          className="ws-topnav__icon-btn"
          aria-label={`Notifications${clampedNotif > 0 ? `, ${clampedNotif} unread` : ""}`}
        >
          <BellIcon />
          {clampedNotif > 0 && (
            <span className="ws-topnav__notif-dot" aria-hidden="true">
              {clampedNotif > 9 ? "9+" : clampedNotif}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <Link
          href="/creator/profile"
          className="ws-topnav__avatar"
          aria-label={`Profile — ${userName}`}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={userName}
              className="ws-topnav__avatar-img"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="ws-topnav__avatar-initial" aria-hidden="true">
              {initial}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

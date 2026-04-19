"use client";

// Push Creator Workspace — TopNav
// Design.md: 56px height, --surface bg, 1px --line bottom border, sticky z-100
// Colors: --primary #c1121f, --dark #003049, --surface, --line
// Fonts: Darky (display/logo), CSGenioMono (body/UI)

import { useState } from "react";
import Link from "next/link";
import { useCommandK } from "@/components/search/CommandKProvider";
import type { CreatorTier } from "@/lib/tier-config";
import "./workspace.css";

// ---------------------------------------------------------------------------
// Tier badge config (workspace-specific, compact display)
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
  // v5.1 mapping aliases
  clay: { bg: "#f7f5f3", color: "#b8a99a", border: "#b8a99a", label: "Clay" },
  bronze: {
    bg: "#fff4e5",
    color: "#c9a96e",
    border: "#c9a96e",
    label: "Bronze",
  },
  steel: { bg: "#eef4f8", color: "#669bbc", border: "#669bbc", label: "Steel" },
  gold: { bg: "#fff8e1", color: "#d4a017", border: "#d4a017", label: "Gold" },
  ruby: { bg: "#fdf0f0", color: "#c1121f", border: "#c1121f", label: "Ruby" },
  obsidian: {
    bg: "#f0f0f4",
    color: "#003049",
    border: "#003049",
    label: "Obsidian",
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface TopNavProps {
  /** Current page display name shown after the slash separator */
  pageName?: string;
  /** Creator's current tier key (lowercase) */
  tier?: string;
  /** Creator display name (for avatar initial) */
  userName?: string;
  /** Unread notification count */
  notifCount?: number;
  /** Avatar image URL — if absent, shows initial avatar */
  avatarUrl?: string;
}

// ---------------------------------------------------------------------------
// Notification Bell icon (inline SVG, no extra dep)
// ---------------------------------------------------------------------------

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
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

// ---------------------------------------------------------------------------
// Search trigger icon
// ---------------------------------------------------------------------------

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="square"
        strokeLinejoin="miter"
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
      />
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
}: TopNavProps) {
  const { open: openSearch } = useCommandK();
  const tierKey = tier.toLowerCase();
  const tierStyle = TIER_BADGE_STYLES[tierKey] ?? TIER_BADGE_STYLES.seed;
  const initial = userName.charAt(0).toUpperCase();

  const clampedNotif = Math.min(notifCount, 99);

  return (
    <header className="ws-topnav" role="banner">
      {/* ── Left: Logo + Page ── */}
      <div className="ws-topnav__left">
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
        <span className="ws-topnav__page">{pageName}</span>
      </div>

      {/* ── Center: Global Search ── */}
      <div className="ws-topnav__center">
        <button
          className="ws-topnav__search"
          onClick={openSearch}
          aria-label="Open search (Cmd+K)"
          type="button"
        >
          <SearchIcon />
          <span className="ws-topnav__search-placeholder">Search…</span>
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

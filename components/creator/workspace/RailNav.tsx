"use client";

/* Repo target: components/creator/workspace/RailNav.tsx
   Modernized collapsible glass rail. Mixes Darky display weights with
   monospace meta rather than mono-everywhere typewriter feel. Live data
   badges (campaigns / unread / payout amount) pulled from demo data so
   the rail has personality instead of being a generic AI nav. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDashboardCounts } from "./useDashboardCounts";

type RailItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badgeKey?:
    | "today"
    | "active"
    | "matches"
    | "earnings"
    | "scans"
    | "unread"
    | "rank";
};

type RailSection = {
  label: string;
  items: RailItem[];
};

const SECTIONS: RailSection[] = [
  {
    label: "Earn",
    items: [
      {
        href: "/creator/dashboard",
        label: "Home",
        icon: <IconHome />,
        badgeKey: "today",
      },
      {
        href: "/creator/work",
        label: "Work",
        icon: <IconWork />,
        badgeKey: "active",
      },
      {
        href: "/creator/discover",
        label: "Discover",
        icon: <IconCompass />,
        badgeKey: "matches",
      },
    ],
  },
  {
    label: "Money",
    items: [
      {
        href: "/creator/earnings",
        label: "Earnings",
        icon: <IconWallet />,
        badgeKey: "earnings",
      },
      {
        href: "/creator/analytics",
        label: "Analytics",
        icon: <IconChart />,
        badgeKey: "scans",
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        href: "/creator/inbox",
        label: "Inbox",
        icon: <IconInbox />,
        badgeKey: "unread",
      },
      {
        href: "/creator/leaderboard",
        label: "Leaderboard",
        icon: <IconTrophy />,
        badgeKey: "rank",
      },
    ],
  },
];

const FOOTER_ITEMS: RailItem[] = [
  { href: "/creator/profile", label: "Profile", icon: <IconUser /> },
  { href: "/creator/settings", label: "Settings", icon: <IconCog /> },
];

export function RailNav() {
  const pathname = usePathname() ?? "";
  const [expanded, setExpanded] = useState(false);
  const expandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const counts = useDashboardCounts();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setExpanded(true);
        setTimeout(() => searchRef.current?.focus(), 220);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onEnter() {
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    expandTimer.current = setTimeout(() => setExpanded(true), 80);
  }
  function onLeave() {
    if (expandTimer.current) clearTimeout(expandTimer.current);
    collapseTimer.current = setTimeout(() => setExpanded(false), 160);
  }

  function isActive(href: string): boolean {
    if (href === "/creator/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={"rl" + (expanded ? " is-expanded" : "")}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link
        href="/creator/dashboard"
        className="rl__logo"
        aria-label="Push home"
      >
        <span className="rl__monogram">P</span>
        <span className="rl__wordmark">Push</span>
      </Link>

      <div className="rl__search">
        <span className="rl__search-icon" aria-hidden="true">
          <IconSearch />
        </span>
        <input
          ref={searchRef}
          type="search"
          className="rl__search-input"
          placeholder="Search"
          aria-label="Search"
        />
        <kbd className="rl__search-hint" aria-hidden="true">
          /
        </kbd>
      </div>

      <nav className="rl__sections" aria-label="Primary">
        {SECTIONS.map((section) => (
          <div key={section.label} className="rl__section">
            <span className="rl__section-label">{section.label}</span>
            {section.items.map((item) => {
              const active = isActive(item.href);
              const badge = item.badgeKey ? counts[item.badgeKey] : undefined;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={"rl__item" + (active ? " is-active" : "")}
                >
                  <span className="rl__item-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="rl__item-label">{item.label}</span>
                  {badge && (
                    <span
                      className={
                        "rl__badge" +
                        (badge.tone ? ` rl__badge--${badge.tone}` : "")
                      }
                    >
                      {badge.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="rl__footer">
        {FOOTER_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={"rl__item" + (isActive(item.href) ? " is-active" : "")}
          >
            <span className="rl__item-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="rl__item-label">{item.label}</span>
          </Link>
        ))}

        <div className="rl__avatar-row">
          <span className="rl__avatar" aria-hidden="true">
            A
          </span>
          <div className="rl__avatar-meta">
            <span className="rl__avatar-name">Alex Chen</span>
            <span className="rl__avatar-tier">Operator · 71</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Inline icons (Lucide-style, 20×20 stroke 1.75) ─────────────── */

function svgProps() {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function IconHome() {
  return (
    <svg {...svgProps()}>
      <path d="M3 12L12 4l9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
function IconWork() {
  return (
    <svg {...svgProps()}>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
function IconCompass() {
  return (
    <svg {...svgProps()}>
      <circle cx="12" cy="12" r="9" />
      <polygon
        points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
        fill="currentColor"
        fillOpacity="0.18"
      />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg {...svgProps()}>
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconWallet() {
  return (
    <svg {...svgProps()}>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M3 10h18" />
      <circle cx="17" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg {...svgProps()}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 16l4-4 3 3 5-7" />
    </svg>
  );
}
function IconInbox() {
  return (
    <svg {...svgProps()}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
function IconTrophy() {
  return (
    <svg {...svgProps()}>
      <path d="M6 4h12v6a6 6 0 0 1-12 0V4z" />
      <path d="M6 6H3v2a3 3 0 0 0 3 3" />
      <path d="M18 6h3v2a3 3 0 0 1-3 3" />
      <path d="M9 16h6l-1 4h-4l-1-4z" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg {...svgProps()}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
    </svg>
  );
}
function IconCog() {
  return (
    <svg {...svgProps()}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

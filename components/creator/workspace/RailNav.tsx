"use client";

/* Repo target: components/creator/dashboard/RailNav.tsx
   Lumin-style collapsible glass rail — 64px collapsed, 200px on hover.
   Replaces the heavier workspace SideNav for the dashboard shell. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type RailItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type RailSection = {
  label: string;
  items: RailItem[];
};

const SECTIONS: RailSection[] = [
  {
    label: "EARN",
    items: [
      { href: "/creator/dashboard", label: "Home", icon: <IconHome /> },
      { href: "/creator/work", label: "Work", icon: <IconWork /> },
      { href: "/creator/discover", label: "Discover", icon: <IconSearch /> },
    ],
  },
  {
    label: "MONEY",
    items: [
      { href: "/creator/earnings", label: "Earnings", icon: <IconDollar /> },
      { href: "/creator/analytics", label: "Analytics", icon: <IconChart /> },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { href: "/creator/inbox", label: "Inbox", icon: <IconInbox /> },
      {
        href: "/creator/leaderboard",
        label: "Leaderboard",
        icon: <IconStar />,
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
        <span className="rl__wordmark">PUSH</span>
      </Link>

      <div className="rl__search">
        <span className="rl__search-icon" aria-hidden="true">
          <IconSearch />
        </span>
        <input
          ref={searchRef}
          type="search"
          className="rl__search-input"
          placeholder="Search ( / )"
          aria-label="Search"
        />
      </div>

      <nav className="rl__sections" aria-label="Primary">
        {SECTIONS.map((section) => (
          <div key={section.label} className="rl__section">
            <span className="rl__section-label">{section.label}</span>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rl__item" + (isActive(item.href) ? " is-active" : "")
                }
              >
                <span className="rl__item-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="rl__item-label">{item.label}</span>
              </Link>
            ))}
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
      </div>
    </aside>
  );
}

/* ── Inline icons (Lucide-style, 20×20 stroke 2) ─────────────────── */

function svgProps() {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
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
function IconDollar() {
  return (
    <svg {...svgProps()}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg {...svgProps()}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
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
function IconStar() {
  return (
    <svg {...svgProps()}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

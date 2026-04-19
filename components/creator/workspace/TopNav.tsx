"use client";

import "./TopNav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ZONES = [
  { href: "/creator/inbox", label: "Inbox", badge: true },
  { href: "/creator/work", label: "Work", badge: false },
  { href: "/creator/portfolio", label: "Portfolio", badge: false },
  { href: "/creator/discover", label: "Discover", badge: false },
] as const;

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="ws-topnav-inner">
      <Link href="/creator/inbox" className="ws-topnav-logo">
        Push
      </Link>

      <nav className="ws-topnav-zones">
        {ZONES.map((zone) => {
          const isActive = pathname.startsWith(zone.href);
          return (
            <Link
              key={zone.href}
              href={zone.href}
              className={`ws-zone-link${isActive ? " ws-zone-link--active" : ""}`}
            >
              {zone.label}
              {zone.badge && (
                <span className="ws-zone-badge" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="ws-topnav-right">
        <button className="ws-search-btn" aria-label="Search (Cmd+K)">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10.5 10.5L14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
          <span className="ws-search-hint">⌘K</span>
        </button>
        <div
          className="ws-avatar"
          aria-label="Account"
          role="button"
          tabIndex={0}
        />
      </div>
    </div>
  );
}

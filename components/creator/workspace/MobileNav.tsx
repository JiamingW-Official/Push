"use client";

// Push Creator Workspace — MobileNav  (Wave 3)
// Design.md: 56px height, --surface-elevated bg, fixed bottom bar
// 5 tabs: Work / Pipeline / Inbox / Discover / Portfolio
// Active: --primary color; Fonts: CS Genio Mono 10px uppercase

import Link from "next/link";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

interface MobileTab {
  id: string;
  label: string;
  icon: string;
  href: string;
  matchPrefix?: boolean;
  unreadDot?: boolean;
}

const MOBILE_TABS: MobileTab[] = [
  { id: "work", label: "Work", icon: "◈", href: "/creator/dashboard" },
  {
    id: "pipeline",
    label: "Pipeline",
    icon: "◇",
    href: "/creator/work/pipeline",
    matchPrefix: true,
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: "✉",
    href: "/creator/messages",
    matchPrefix: true,
    unreadDot: true,
  },
  {
    id: "discover",
    label: "Discover",
    icon: "◐",
    href: "/creator/explore",
    matchPrefix: true,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: "◆",
    href: "/creator/portfolio",
    matchPrefix: true,
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MobileNavProps {
  /** Badge/unread counts — key = tab id */
  unreadCounts?: Record<string, number>;
  /** Called when a tab is tapped (optional extra handler) */
  onTabClick?: (tabId: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MobileNav({ unreadCounts = {}, onTabClick }: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (tab: MobileTab) => {
    if (tab.href === "/creator/dashboard") return pathname === tab.href;
    if (tab.matchPrefix) return pathname.startsWith(tab.href);
    return pathname === tab.href;
  };

  return (
    <nav className="ws-mobile-nav" aria-label="Bottom navigation">
      {MOBILE_TABS.map((tab) => {
        const active = isActive(tab);
        const unread = unreadCounts[tab.id] ?? 0;

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`ws-mobile-nav__tab${active ? " ws-mobile-nav__tab--active" : ""}`}
            aria-current={active ? "page" : undefined}
            aria-label={`${tab.label}${unread > 0 ? `, ${unread} unread` : ""}`}
            onClick={() => onTabClick?.(tab.id)}
          >
            <span className="ws-mobile-nav__icon" aria-hidden="true">
              {tab.icon}
              {/* Unread dot */}
              {tab.unreadDot && unread > 0 && (
                <span
                  className="ws-mobile-nav__unread-dot"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="ws-mobile-nav__label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

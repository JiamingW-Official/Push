"use client";

/**
 * Mobile bottom-nav (audit § P1-11). Fixed bottom dock with 5 entries:
 *   Today · Gigs · Discover · Earnings · Me
 *
 * "Me" opens an avatar menu (Settings / Inbox / Sign out). Hides on
 *  ≥768px (the desktop sidenav handles that range).
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./MobileBottomNav.css";

type ItemKey = "today" | "gigs" | "discover" | "earnings" | "me";

const ITEMS: { key: ItemKey; label: string; href?: string; icon: string }[] = [
  {
    key: "today",
    label: "Today",
    href: "/creator/today",
    icon: "M9 22V12h6v10M3 9.5L12 2l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z",
  },
  {
    key: "gigs",
    label: "Work",
    href: "/creator/work",
    icon: "M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  },
  {
    key: "discover",
    label: "Find",
    href: "/creator/discover",
    icon: "M21 21l-6-6M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
  },
  {
    key: "earnings",
    label: "Pay",
    href: "/creator/money",
    icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
  {
    key: "me",
    label: "Me",
    icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0",
  },
];

export function MobileBottomNav() {
  const pathname = usePathname() ?? "";
  const [meOpen, setMeOpen] = useState(false);
  const meRef = useRef<HTMLDivElement>(null);

  /* Close Me menu on click outside or Esc. */
  useEffect(() => {
    if (!meOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!meRef.current?.contains(e.target as Node)) setMeOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMeOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [meOpen]);

  /* Close menu on route change. */
  useEffect(() => {
    setMeOpen(false);
  }, [pathname]);

  function isActive(href?: string): boolean {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="mob-bnav" aria-label="Creator navigation (mobile)">
      {ITEMS.map((item) => {
        const active = item.key === "me" ? meOpen : isActive(item.href);

        if (item.key === "me") {
          return (
            <div key={item.key} className="mob-bnav__me-wrap" ref={meRef}>
              <button
                type="button"
                className={`mob-bnav__btn${active ? " is-active" : ""}`}
                aria-label="Me menu"
                aria-expanded={meOpen}
                onClick={() => setMeOpen((v) => !v)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d={item.icon}
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mob-bnav__label">{item.label}</span>
              </button>
              {meOpen ? (
                <div className="mob-bnav__menu" role="menu">
                  <Link
                    href="/creator/settings"
                    role="menuitem"
                    className="mob-bnav__menu-item"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/creator/inbox"
                    role="menuitem"
                    className="mob-bnav__menu-item"
                  >
                    Inbox
                  </Link>
                  <Link
                    href="/creator/today?notifications=open"
                    role="menuitem"
                    className="mob-bnav__menu-item"
                  >
                    Notifications
                  </Link>
                  <Link
                    href="/creator/leaderboard"
                    role="menuitem"
                    className="mob-bnav__menu-item"
                  >
                    Leaderboard
                  </Link>
                  <hr className="mob-bnav__menu-sep" />
                  <Link
                    href="/creator/login"
                    role="menuitem"
                    className="mob-bnav__menu-item"
                  >
                    Sign out
                  </Link>
                </div>
              ) : null}
            </div>
          );
        }

        return (
          <Link
            key={item.key}
            href={item.href ?? "#"}
            className={`mob-bnav__btn${active ? " is-active" : ""}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d={item.icon}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mob-bnav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

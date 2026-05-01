"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";

export interface NavItem {
  key: string;
  label: string;
  icon?: string;
  danger?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

interface SettingsShellProps {
  title?: string;
  /** Preferred — Instagram-style grouped categories. */
  navGroups?: NavGroup[];
  /** Legacy flat list (still supported, wrapped into a single group). */
  navItems?: NavItem[];
  activeSection: string;
  onSectionChange: (key: string) => void;
  children: ReactNode;
  backHref?: string;
}

export function SettingsShell({
  title = "Settings",
  navGroups,
  navItems,
  activeSection,
  onSectionChange,
  children,
  backHref = "/creator/dashboard",
}: SettingsShellProps) {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseGroups: NavGroup[] = useMemo(
    () => navGroups ?? (navItems ? [{ label: "", items: navItems }] : []),
    [navGroups, navItems],
  );

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return baseGroups;
    const q = search.trim().toLowerCase();
    return baseGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [baseGroups, search]);

  const allItems = baseGroups.flatMap((g) => g.items);
  const activeItem = allItems.find((i) => i.key === activeSection);

  return (
    <div className="settings-shell">
      {/* Mobile header */}
      <div className="settings-mobile-header">
        <button
          type="button"
          className="settings-mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
        >
          <span className="settings-mobile-toggle__icon">
            {mobileOpen ? "✕" : "☰"}
          </span>
          <span>{activeItem?.label ?? title}</span>
        </button>
      </div>

      {/* Secondary settings sidebar */}
      <aside
        className={`settings-side${mobileOpen ? " is-open" : ""}`}
        aria-label="Settings categories"
      >
        <header className="settings-side__head">
          <Link href={backHref} className="settings-side__back">
            <ChevronLeft />
            <span>Dashboard</span>
          </Link>
          <h1 className="settings-side__title">{title}</h1>
          <label className="settings-side__search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search settings"
            />
          </label>
        </header>

        <nav className="settings-side__nav">
          {filteredGroups.map((group, gi) => (
            <section
              key={group.label || `g-${gi}`}
              className="settings-side__group"
            >
              {group.label && (
                <h2 className="settings-side__group-label">{group.label}</h2>
              )}
              <div className="settings-side__items">
                {group.items.map((item) => {
                  const active = item.key === activeSection;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={[
                        "settings-side__item",
                        active ? "is-active" : "",
                        item.danger ? "is-danger" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-current={active ? "page" : undefined}
                      onClick={() => {
                        onSectionChange(item.key);
                        setMobileOpen(false);
                      }}
                    >
                      {item.icon && (
                        <span
                          className="settings-side__item-icon"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      )}
                      <span className="settings-side__item-label">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          {filteredGroups.length === 0 && (
            <p className="settings-side__empty">No matches for “{search}”.</p>
          )}
        </nav>
      </aside>

      {/* Main pane */}
      <main className="settings-pane" id="settings-content">
        <div className="settings-pane__inner">{children}</div>
      </main>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="settings-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/* ── Inline icons ──────────────────────────────────────────── */

function ChevronLeft() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  );
}

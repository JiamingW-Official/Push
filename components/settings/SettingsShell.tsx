"use client";

import { useState } from "react";

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  danger?: boolean;
}

interface SettingsShellProps {
  title: string;
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (key: string) => void;
  children: React.ReactNode;
}

export function SettingsShell({
  title,
  navItems,
  activeSection,
  onSectionChange,
  children,
}: SettingsShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = navItems.find((n) => n.key === activeSection);

  return (
    <div className="settings-shell">
      {/* Mobile header */}
      <div className="settings-mobile-header">
        <button
          className="settings-mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
        >
          <span className="settings-mobile-toggle__icon">
            {mobileOpen ? "✕" : "☰"}
          </span>
          <span>{activeItem?.label ?? "Settings"}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`settings-sidebar${mobileOpen ? " settings-sidebar--open" : ""}`}
      >
        <div className="settings-sidebar__header">
          <span className="settings-sidebar__label">SETTINGS</span>
          <span className="settings-sidebar__title">{title}</span>
        </div>
        <nav className="settings-sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`settings-nav-item${item.key === activeSection ? " settings-nav-item--active" : ""}${item.danger ? " settings-nav-item--danger" : ""}`}
              onClick={() => {
                onSectionChange(item.key);
                setMobileOpen(false);
              }}
            >
              <span className="settings-nav-item__icon">{item.icon}</span>
              <span className="settings-nav-item__label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main pane */}
      <main className="settings-pane">{children}</main>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="settings-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}

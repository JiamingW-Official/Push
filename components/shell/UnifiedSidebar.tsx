"use client";

// Push — Unified Sidebar
//
// One sidebar for admin / creator / merchant. Fixed-position 72px column,
// pinned to the viewport (顶天立地, never scrolls). Default state = floating
// dark-ink icons over the page (no rail chrome). On hover of an INDIVIDUAL
// icon, just that icon expands rightward into a dark liquid-glass pill that
// reveals its label. Other items stay collapsed. Bottom cluster:
// Notifications (with count) → Settings → Avatar.
//
// Authority: Design.md v11 § 8.9 (Liquid Glass), § 9 (no per-page custom),
//            globals.css `--ease-spring`.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, type IconKey } from "./sidebar-icons";
import "./unified-sidebar.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SidebarRole = "admin" | "creator" | "merchant";

interface NavItem {
  label: string;
  href: string;
  icon: IconKey;
  exact?: boolean;
}

interface SidebarConfig {
  homeHref: string;
  primary: NavItem[];
  notificationsHref: string;
  settingsHref: string;
  profileHref: string;
}

// ---------------------------------------------------------------------------
// Role configs
// ---------------------------------------------------------------------------

const CONFIGS: Record<SidebarRole, SidebarConfig> = {
  admin: {
    homeHref: "/admin",
    primary: [
      // Short captions (≤8 chars) sit under each icon. Verbose names live
      // in href + page heading for context; aria-label echoes route purpose.
      { label: "Cohorts", href: "/admin/cohorts", icon: "cohorts" },
      { label: "Camps", href: "/admin/campaigns", icon: "campaigns" },
      { label: "Users", href: "/admin/users", icon: "users" },
      { label: "Finance", href: "/admin/finance", icon: "finance" },
      { label: "Verify", href: "/admin/verifications", icon: "shield" },
      { label: "Fraud", href: "/admin/fraud", icon: "scale" },
      { label: "Disputes", href: "/admin/disputes", icon: "messages" },
      { label: "Privacy", href: "/admin/privacy-requests", icon: "lock" },
      { label: "Oracle", href: "/admin/oracle-trigger", icon: "sparkle" },
      { label: "Audit", href: "/admin/audit-log", icon: "audit" },
    ],
    notificationsHref: "/admin/notifications",
    settingsHref: "/admin/settings",
    profileHref: "/admin",
  },
  creator: {
    homeHref: "/creator/dashboard",
    primary: [
      // Short captions (≤5 chars): live under each icon, no hover needed.
      // Full route name kept in href so analytics/aria still read clean.
      { label: "Today", href: "/creator/dashboard", icon: "home", exact: true },
      { label: "Gigs", href: "/creator/work", icon: "work" },
      { label: "Find", href: "/creator/discover", icon: "discover" },
      { label: "Pay", href: "/creator/earnings", icon: "earnings" },
      { label: "Stats", href: "/creator/analytics", icon: "analytics" },
      { label: "Inbox", href: "/creator/inbox", icon: "inbox" },
      { label: "Ranks", href: "/creator/leaderboard", icon: "trophy" },
    ],
    notificationsHref: "/creator/notifications",
    settingsHref: "/creator/settings",
    profileHref: "/creator/profile",
  },
  merchant: {
    homeHref: "/merchant/dashboard",
    primary: [
      // Camps / Today / Stats / Inbox / Pay are shared with admin & creator
      // for cross-role muscle memory.
      { label: "Today", href: "/merchant/dashboard", icon: "home", exact: true },
      { label: "Camps", href: "/merchant/campaigns", icon: "campaigns" },
      { label: "Pool", href: "/merchant/applicants", icon: "applicants" },
      { label: "Stats", href: "/merchant/analytics", icon: "analytics" },
      { label: "Codes", href: "/merchant/qr-codes", icon: "qr" },
      { label: "Redeem", href: "/merchant/redeem", icon: "redeem" },
      { label: "Spots", href: "/merchant/locations", icon: "location" },
      { label: "Inbox", href: "/merchant/messages", icon: "messages" },
      { label: "Pay", href: "/merchant/payments", icon: "payments" },
      { label: "Billing", href: "/merchant/billing", icon: "billing" },
    ],
    notificationsHref: "/merchant/notifications",
    settingsHref: "/merchant/settings",
    profileHref: "/merchant/settings",
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface UnifiedSidebarProps {
  role: SidebarRole;
  notificationCount?: number;
  userInitial?: string;
  avatarUrl?: string;
  userName?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UnifiedSidebar({
  role,
  notificationCount = 0,
  userInitial,
  avatarUrl,
  userName,
}: UnifiedSidebarProps) {
  const pathname = usePathname() ?? "";
  const config = CONFIGS[role];

  const initial = userInitial ?? role.charAt(0).toUpperCase();
  const name = userName ?? `${role[0].toUpperCase()}${role.slice(1)} account`;

  const isActive = (href: string, exact?: boolean): boolean => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const showBadge = notificationCount > 0;
  const badgeText = notificationCount > 99 ? "99+" : String(notificationCount);

  return (
    <aside
      className="us-rail"
      data-role={role}
      aria-label={`${role} navigation`}
    >
      {/* Logo — same per-item pill pattern */}
      <Link
        href={config.homeHref}
        className="us-item us-item--logo"
        aria-label="Push home"
      >
        <span className="us-item__pill">
          <span className="us-item__icon" aria-hidden="true">
            <span className="us-logo__mark">P</span>
          </span>
          <span className="us-item__label">Push</span>
        </span>
      </Link>

      <nav className="us-nav" aria-label="Primary">
        {config.primary.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`us-item${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="us-item__pill">
                <span className="us-item__icon" aria-hidden="true">
                  <Icon name={item.icon} />
                </span>
                <span className="us-item__label">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="us-foot">
        <Link
          href={config.notificationsHref}
          className={`us-item${
            isActive(config.notificationsHref) ? " is-active" : ""
          }`}
          aria-label={
            showBadge
              ? `Notifications, ${notificationCount} unread`
              : "Notifications"
          }
        >
          <span className="us-item__pill">
            <span className="us-item__icon" aria-hidden="true">
              <Icon name="bell" />
              {showBadge && (
                <span className="us-badge" aria-hidden="true">
                  {badgeText}
                </span>
              )}
            </span>
            <span className="us-item__label">Alerts</span>
          </span>
        </Link>

        <Link
          href={config.settingsHref}
          className={`us-item${
            isActive(config.settingsHref) ? " is-active" : ""
          }`}
          aria-label="Settings"
        >
          <span className="us-item__pill">
            <span className="us-item__icon" aria-hidden="true">
              <Icon name="settings" />
            </span>
            <span className="us-item__label">Settings</span>
          </span>
        </Link>

        <Link
          href={config.profileHref}
          className={`us-item us-item--avatar${
            isActive(config.profileHref) ? " is-active" : ""
          }`}
          aria-label={`Profile — ${name}`}
        >
          <span className="us-item__pill">
            <span className="us-item__icon" aria-hidden="true">
              <span className="us-avatar-circle">
                {avatarUrl ? (
                  <AvatarImg src={avatarUrl} alt={name} />
                ) : (
                  <span className="us-avatar-circle__initial">{initial}</span>
                )}
              </span>
            </span>
            {/* Caption is intentionally generic ("Me") — full name lives
                in aria-label above for screen readers + analytics. */}
            <span className="us-item__label">Me</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function AvatarImg({ src, alt }: { src: string; alt: string }): ReactNode {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="us-avatar-circle__img"
      loading="lazy"
      decoding="async"
    />
  );
}

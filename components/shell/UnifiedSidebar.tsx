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
import { useOptionalWorkspaceState } from "@/lib/workspace/state";
import { useNow } from "@/lib/workspace/hooks";
import { useInvitesLive } from "@/lib/data/hooks";
import { buildActionQueue } from "@/lib/today/briefing";
import { useCommandPalette } from "@/components/feedback/CommandPalette";
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
      // 7-domain canonical IA per architectural audit § 3.1.
      // Today · Work · Money · Find · Comms · Me · Stats
      { label: "Today", href: "/creator/today", icon: "home", exact: true },
      { label: "Work", href: "/creator/work", icon: "work" },
      { label: "Find", href: "/creator/discover", icon: "discover" },
      { label: "Pay", href: "/creator/money", icon: "earnings" },
      { label: "Comms", href: "/creator/comms", icon: "inbox" },
      { label: "Me", href: "/creator/me", icon: "trophy" },
      { label: "Stats", href: "/creator/analytics", icon: "analytics" },
    ],
    notificationsHref: "/creator/notifications",
    settingsHref: "/creator/settings",
    /* Profile content moved under /settings/account in audit § P1-7. The
       avatar bottom-tile still routes to the legacy /creator/profile until
       the form is migrated; it remains reachable via the Account sub-route. */
    profileHref: "/creator/settings/account",
  },
  merchant: {
    homeHref: "/merchant/dashboard",
    primary: [
      // Camps / Today / Stats / Inbox / Pay are shared with admin & creator
      // for cross-role muscle memory.
      {
        label: "Today",
        href: "/merchant/dashboard",
        icon: "home",
        exact: true,
      },
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
  /** Unread inbox badge — appears on the Inbox/Messages nav item.
   *  Currently merchant-only; pass through MerchantShell's
   *  useThreadInboxStream + mock thread sum. */
  inboxUnread?: number;
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
  inboxUnread = 0,
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

  const ws = useOptionalWorkspaceState();
  const now = useNow();
  const gigsPending =
    role === "creator" && ws
      ? ws.invites.filter((i) => i.status === "pending").length
      : 0;
  const gigsUrgent =
    role === "creator" && ws && now != null
      ? ws.invites.filter(
          (i) =>
            i.status === "pending" && i.expiresAt - now < 6 * 60 * 60 * 1000,
        ).length
      : 0;

  /* Realtime invite-arrival pulse. Subscribes only on the creator surface
     (no creatorId in non-creator roles → no-op). The dot fires for 2s
     when a new campaign_application row hits Supabase. */
  const { pendingPulse } = useInvitesLive(
    role === "creator" ? (userName ?? undefined) : undefined,
  );

  const todayActionCount =
    role === "creator" && ws && now != null
      ? buildActionQueue({
          now,
          threads: ws.threads,
          invites: ws.invites,
          notifications: ws.notifications,
          attributionEvents: ws.attributionEvents ?? [],
          dismissedActionIds: ws.dismissedActionIds ?? [],
          snoozedActionIds: ws.snoozedActionIds ?? {},
        }).filter((a) => a.urgency > 1.5).length
      : 0;

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
          const isGigs = item.href === "/creator/gigs";
          const isTodayItem = item.href === "/creator/dashboard";
          const isMerchantInbox =
            role === "merchant" && item.href === "/merchant/messages";
          const itemBadge =
            isGigs && gigsPending > 0
              ? gigsPending
              : isTodayItem && todayActionCount > 0
                ? todayActionCount
                : isMerchantInbox && inboxUnread > 0
                  ? inboxUnread
                  : 0;
          // Merchant inbox unread is a soft notification (no urgency tier),
          // gigs urgent + today urgent already drive the urgent variant.
          const itemBadgeUrgent =
            (isGigs && gigsUrgent > 0) || (isTodayItem && todayActionCount > 0);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`us-item${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={
                isGigs && itemBadge > 0
                  ? `Gigs, ${itemBadge} pending invite${itemBadge === 1 ? "" : "s"}`
                  : isTodayItem && itemBadge > 0
                    ? `Today, ${itemBadge} urgent action${itemBadge === 1 ? "" : "s"}`
                    : isMerchantInbox && itemBadge > 0
                      ? `Inbox, ${itemBadge} unread message${itemBadge === 1 ? "" : "s"}`
                      : undefined
              }
            >
              <span className="us-item__pill">
                <span className="us-item__icon" aria-hidden="true">
                  <Icon name={item.icon} />
                  {itemBadge > 0 && (
                    <span
                      className={`us-badge${itemBadgeUrgent ? " us-badge--urgent" : ""}`}
                      aria-hidden="true"
                    >
                      {itemBadge > 99 ? "99+" : String(itemBadge)}
                    </span>
                  )}
                </span>
                <span className="us-item__label">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="us-foot">
        <CommandKHintPill />
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
                {/* Live invite-arrival dot. Visible 2s when a new invite
                    lands via subscribeInvites. Pure presentation. */}
                {pendingPulse && (
                  <span className="us-avatar-pulse" aria-hidden />
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

/* Discoverability pill — sits in us-foot above Settings. Click opens the
   global command palette. Visible on every role surface. */
function CommandKHintPill() {
  const { open } = useCommandPalette();
  return (
    <button
      type="button"
      className="us-cmdk-pill"
      onClick={open}
      aria-label="Open command palette"
      title="Command palette (⌘K)"
    >
      <span aria-hidden>⌘K</span>
    </button>
  );
}

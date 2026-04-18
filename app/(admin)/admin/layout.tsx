"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./admin.css";

/* ── Auth check — cookie demo stub ──────────────────────────── */
function getAdminRole(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=admin");
}

/* ── SVG nav icons ───────────────────────────────────────────── */
const IconOverview = () => (
  <svg
    className="adm-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="1" y="1" width="6" height="6" />
    <rect x="9" y="1" width="6" height="6" />
    <rect x="1" y="9" width="6" height="6" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
);

const IconFraud = () => (
  <svg
    className="adm-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M8 1L1 14h14L8 1Z" />
    <line x1="8" y1="6" x2="8" y2="10" />
    <circle cx="8" cy="12" r="0.5" fill="currentColor" />
  </svg>
);

const IconVerify = () => (
  <svg
    className="adm-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M8 1l7 3v4c0 3.5-3 6-7 7C5 14 2 12 1 8V4L8 1Z" />
    <polyline points="5,8 7,10 11,6" />
  </svg>
);

const IconDispute = () => (
  <svg
    className="adm-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="8" cy="8" r="7" />
    <line x1="8" y1="5" x2="8" y2="9" />
    <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
  </svg>
);

const IconCohorts = () => (
  <svg
    className="adm-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="5" cy="6" r="3" />
    <circle cx="11" cy="6" r="3" />
    <path d="M1 14c0-2.5 1.8-4 4-4" />
    <path d="M15 14c0-2.5-1.8-4-4-4" />
    <path d="M7 11c.3-.1.7-.1 1 0" />
  </svg>
);

const IconUsers = () => (
  <svg
    className="adm-nav-item__icon"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="8" cy="5" r="3.5" />
    <path d="M1 15c0-3.5 3-6 7-6s7 2.5 7 6" />
  </svg>
);

/* ── Nav items config ────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: IconOverview },
  { href: "/admin/fraud", label: "Fraud", icon: IconFraud },
  { href: "/admin/verifications", label: "Verifications", icon: IconVerify },
  { href: "/admin/disputes", label: "Disputes", icon: IconDispute },
  { href: "/admin/cohorts", label: "Cohorts", icon: IconCohorts },
  { href: "/admin/users", label: "Users", icon: IconUsers },
] as const;

/* ── Access denied ───────────────────────────────────────────── */
function AccessDenied() {
  return (
    <div className="adm-denied">
      <div className="adm-denied__wordmark">
        Push<span>.</span>
      </div>
      <div className="adm-denied__rule" />
      <div className="adm-denied__headline">Admins only.</div>
      <div className="adm-denied__sub">
        This console is restricted to Push operations staff.
        <br />
        <br />
        <a
          href="/demo/admin"
          style={{
            color: "rgba(245,242,236,0.55)",
            textDecoration: "none",
            fontSize: "12px",
            letterSpacing: "0.06em",
          }}
        >
          Request demo access →
        </a>
      </div>
    </div>
  );
}

/* ── Layout shell ────────────────────────────────────────────── */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    setIsAdmin(getAdminRole());
  }, []);

  // Live clock for topbar
  useEffect(() => {
    function tick() {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/New_York",
        }) + " EST",
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Still hydrating
  if (isAdmin === null) return null;

  if (!isAdmin) return <AccessDenied />;

  const currentLabel =
    NAV_ITEMS.find((n) => n.href === pathname)?.label ?? "Console";

  return (
    <div className="adm-shell">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <a href="/admin" className="adm-sidebar__logo">
          <span className="adm-sidebar__wordmark">
            Push<span>.</span>
          </span>
          <span className="adm-sidebar__badge">Ops Console</span>
        </a>

        <nav className="adm-sidebar__nav">
          <div className="adm-nav-section">
            <div className="adm-nav-section__label">Operations</div>
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className={`adm-nav-item${pathname === href ? " active" : ""}`}
              >
                <Icon />
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="adm-sidebar__footer">
          <div className="adm-sidebar__user">push-demo-role=admin</div>
          <button
            className="adm-signout"
            onClick={() => {
              document.cookie = "push-demo-role=; path=/; max-age=0";
              window.location.href = "/demo";
            }}
          >
            Exit console →
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar__title">{currentLabel}</div>
          <div className="adm-topbar__time">{clock}</div>
        </div>
        <div className="adm-content">{children}</div>
      </div>
    </div>
  );
}

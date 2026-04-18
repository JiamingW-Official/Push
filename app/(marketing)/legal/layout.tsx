"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./legal.css";

const NAV_ITEMS = [
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/acceptable-use", label: "Acceptable Use" },
];

// Right sidebar content — links to other docs + actions
function LegalSidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="legal-sidebar">
      <div>
        <p className="legal-sidebar__section-label">Legal Documents</p>
        <ul className="legal-sidebar__links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              {currentPath === item.href ? (
                <span className="legal-sidebar__link legal-sidebar__link--current">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="legal-sidebar__link">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <hr className="legal-sidebar__divider" />

      <div>
        <p className="legal-sidebar__section-label">Actions</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Download PDF — stub, no-op for now */}
          <button className="legal-sidebar__btn" aria-label="Download PDF">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 1v8M4 6l3 3 3-3M2 11h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
            Download PDF
          </button>
          {/* Contact DPO */}
          <a
            href="mailto:privacy@pushnyc.co"
            className="legal-sidebar__btn legal-sidebar__btn--primary"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="1"
                y="3"
                width="12"
                height="8"
                rx="0"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M1 3l6 5 6-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
            Contact DPO
          </a>
        </div>
      </div>

      <hr className="legal-sidebar__divider" />

      <div>
        <p className="legal-sidebar__section-label">Last Review</p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--graphite)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          April 15, 2026
          <br />
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
            Reviewed by Push Legal Counsel
          </span>
        </p>
      </div>
    </aside>
  );
}

// Left sticky nav
function LegalSideNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="legal-sidenav" aria-label="Legal documents navigation">
      <p className="legal-sidenav__label">Legal</p>
      <ul className="legal-sidenav__list">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <li
              key={item.href}
              className={`legal-sidenav__item${isActive ? " legal-sidenav__item--active" : ""}`}
            >
              <Link href={item.href} className="legal-sidenav__link">
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Normalize: strip trailing slash
  const currentPath = pathname.replace(/\/$/, "");

  return (
    <div className="legal-shell">
      <div className="legal-container">
        <LegalSideNav currentPath={currentPath} />
        <main className="legal-body">{children}</main>
        <LegalSidebar currentPath={currentPath} />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDE_NAV, getZoneFromPath } from "./side-nav-config";
import "./SideNav.css";

const ICON_PATHS: Record<string, string> = {
  inbox: "M3 8l5-5 5 5M8 3v10",
  mail: "M2 4h12v8H2zM2 4l6 5 6-5",
  chat: "M2 3h12v9H2zM5 15l3-3",
  bell: "M8 2a5 5 0 015 5v3l1 2H2l1-2V7a5 5 0 015-5zm-1 11h2",
  sun: "M8 5v1M8 14v1M3 8H2M14 8h1M4.9 4.9l-.7-.7M11.8 11.8l-.7-.7M4.9 11.1l-.7.7M11.8 4.2l-.7.7M8 6a2 2 0 100 4 2 2 0 000-4z",
  flow: "M3 4h4M3 8h8M3 12h6M9 4l3 4-3 4",
  cal: "M2 5h12v9H2zM2 5V3h12v2M5 3V2M11 3V2",
  draft: "M3 4h8M3 8h6M3 12h4M10 9l3-3 1 1-3 3z",
  id: "M2 4h12v8H2zM5 10a2 2 0 110-4 2 2 0 010 4zM9 7h3M9 9h2",
  cash: "M8 2v2M8 12v2M4 8H2M14 8h-2M5 5l-1-1M11 5l1-1M5 11l-1 1M11 11l1 1M8 5a3 3 0 100 6 3 3 0 000-6z",
  box: "M2 6l6-3 6 3M2 6v7l6 3 6-3V6M8 3v10",
};

function NavIcon({ icon }: { icon: string }) {
  const d = ICON_PATHS[icon] ?? "";
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="ws-sidenav-icon"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function SideNav() {
  const pathname = usePathname();
  const zone = getZoneFromPath(pathname);
  const items = SIDE_NAV[zone];

  if (items.length === 0) {
    return (
      <div className="ws-sidenav-inner ws-sidenav-empty">
        <span className="ws-sidenav-zone-label">Discover</span>
      </div>
    );
  }

  return (
    <div className="ws-sidenav-inner">
      <span className="ws-sidenav-zone-label">{zone.toUpperCase()}</span>
      <ul className="ws-sidenav-list" role="list">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`ws-sidenav-item${isActive ? " ws-sidenav-item--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <NavIcon icon={item.icon} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

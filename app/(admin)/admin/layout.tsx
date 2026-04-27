"use client";

import "./admin.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { ADMIN_GROUPS } from "@/lib/nav/registry";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DemoBanner />
      <div className="adm-shell">
        <AdminSidebar />
        <main className="adm-main">{children}</main>
      </div>
    </>
  );
}

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="adm-sidebar">
      <Link href="/admin" className="adm-sidebar__logo">
        <span className="adm-sidebar__wordmark">
          Push<span>Admin</span>
        </span>
        <span className="adm-sidebar__badge">Operations Console</span>
      </Link>

      <nav className="adm-sidebar__nav">
        {ADMIN_GROUPS.map((group) => (
          <div key={group.label} className="adm-nav-section">
            <p className="adm-nav-section__label">{group.label}</p>
            {group.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`adm-nav-item${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="adm-sidebar__footer">
        <p className="adm-sidebar__user">push-admin@internal</p>
        <Link href="/admin/login" className="adm-signout">
          Sign out
        </Link>
      </div>
    </aside>
  );
}

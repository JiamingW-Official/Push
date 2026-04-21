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
      <div className="admin-shell">
        <nav className="admin-nav">
          <a href="/admin" className="admin-nav__brand">
            Push<span>Admin</span>
          </a>
          {ADMIN_GROUPS.map((group) => (
            <div key={group.label} className="admin-nav__group">
              <p className="admin-nav__group-label">{group.label}</p>
              <ul className="admin-nav__links">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}

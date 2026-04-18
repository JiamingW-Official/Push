export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <a href="/admin/cohorts" className="admin-nav__brand">
          Push<span>Admin</span>
        </a>
        <ul className="admin-nav__links">
          <li>
            <a href="/admin/cohorts">Cohorts</a>
          </li>
        </ul>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}

const NAV_GROUPS: Array<{
  label: string;
  items: Array<{ href: string; label: string }>;
}> = [
  {
    label: "Operations",
    items: [
      { href: "/admin/cohorts", label: "Cohorts" },
      { href: "/admin/campaigns", label: "Campaigns" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/finance", label: "Finance" },
    ],
  },
  {
    label: "Trust & Safety",
    items: [
      { href: "/admin/verifications", label: "Verifications" },
      { href: "/admin/fraud", label: "Fraud" },
      { href: "/admin/disputes", label: "Disputes" },
      { href: "/admin/privacy-requests", label: "Privacy Requests" },
    ],
  },
  {
    label: "Oracle",
    items: [{ href: "/admin/oracle-trigger", label: "Oracle Trigger" }],
  },
  {
    label: "Audit",
    items: [{ href: "/admin/audit-log", label: "Audit Log" }],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <a href="/admin" className="admin-nav__brand">
          Push<span>Admin</span>
        </a>
        {NAV_GROUPS.map((group) => (
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
  );
}

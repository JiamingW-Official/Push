"use client";

// Merchant portal side nav. Closes the "merchant layout has no nav" gap
// surfaced in the v5.3-EXEC audit. Reads from lib/nav/registry to stay
// in sync with every other layout.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MERCHANT_PRIMARY, MERCHANT_SECONDARY } from "@/lib/nav/registry";
import { BRAND } from "@/lib/constants/brand";

function isActive(href: string, pathname: string, prefix?: boolean): boolean {
  if (prefix) return pathname.startsWith(href);
  return pathname === href;
}

export function MerchantSideNav() {
  const pathname = usePathname() ?? "";
  return (
    <aside style={S.shell} aria-label="Merchant navigation">
      <Link href="/merchant/dashboard" style={S.brand}>
        {BRAND.name}
        <span style={S.brandTag}>Merchant</span>
      </Link>

      <nav style={S.nav}>
        <ul style={S.list}>
          {MERCHANT_PRIMARY.map((item) => {
            const active = isActive(item.href, pathname, item.prefix);
            return (
              <li key={item.href} style={S.li}>
                <Link
                  href={item.href}
                  style={{ ...S.link, ...(active ? S.linkActive : null) }}
                >
                  <span style={S.icon}>{item.icon}</span>
                  <span style={S.label}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <hr style={S.divider} />

        <ul style={S.list}>
          {MERCHANT_SECONDARY.map((item) => {
            const active = isActive(item.href, pathname, item.prefix);
            return (
              <li key={item.href} style={S.li}>
                <Link
                  href={item.href}
                  style={{ ...S.secondary, ...(active ? S.linkActive : null) }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={S.footer}>
        <Link href="/" style={S.footLink}>
          Exit to marketing →
        </Link>
      </div>
    </aside>
  );
}

const S = {
  shell: {
    width: "240px",
    minHeight: "100vh",
    borderRight: "1px solid var(--line)",
    background: "var(--surface)",
    display: "flex",
    flexDirection: "column" as const,
    fontFamily: "var(--font-body)",
    padding: "24px 0",
  } as React.CSSProperties,
  brand: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
    padding: "0 24px 24px",
    fontFamily: "var(--font-display)",
    fontSize: "22px",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    fontStyle: "italic" as const,
    color: "var(--ink)",
    textDecoration: "none",
    borderBottom: "1px solid rgba(10,10,10,0.08)",
  } as React.CSSProperties,
  brandTag: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontStyle: "normal" as const,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--brand-red)",
  } as React.CSSProperties,
  nav: {
    flex: 1,
    padding: "16px 0",
    overflowY: "auto" as const,
  } as React.CSSProperties,
  list: { listStyle: "none", padding: 0, margin: 0 } as React.CSSProperties,
  li: {} as React.CSSProperties,
  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 24px",
    borderLeft: "3px solid transparent",
    color: "var(--ink)",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
  } as React.CSSProperties,
  linkActive: {
    borderLeftColor: "var(--brand-red)",
    color: "var(--brand-red)",
  } as React.CSSProperties,
  secondary: {
    display: "block",
    padding: "6px 24px",
    color: "rgba(10,10,10,0.7)",
    fontSize: "12px",
    textDecoration: "none",
    borderLeft: "3px solid transparent",
  } as React.CSSProperties,
  icon: {
    width: "20px",
    display: "inline-flex",
    justifyContent: "center",
    fontSize: "16px",
  } as React.CSSProperties,
  label: {} as React.CSSProperties,
  divider: {
    margin: "16px 24px",
    border: 0,
    borderTop: "1px solid rgba(10,10,10,0.08)",
  } as React.CSSProperties,
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid rgba(10,10,10,0.08)",
  } as React.CSSProperties,
  footLink: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    color: "var(--ink-4)",
    textDecoration: "none",
  } as React.CSSProperties,
};

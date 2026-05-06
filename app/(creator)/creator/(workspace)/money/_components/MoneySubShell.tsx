/**
 * Shared shell for /creator/money/<sub> sub-routes. Renders a
 * back-link to the hub + Magvix Italic title + body + optional CTAs.
 *
 * This stays intentionally thin — sub-route depth (filters, tables,
 * forms) lives in each page's body, not in this wrapper.
 */

import Link from "next/link";
import type { ReactNode } from "react";

export type MoneySubShellProps = {
  title: string;
  body: string;
  cta?: { href: string; label: string; variant?: "primary" | "ghost" }[];
  children?: ReactNode;
};

export function MoneySubShell({
  title,
  body,
  cta,
  children,
}: MoneySubShellProps) {
  return (
    <main className="money-sub" aria-label={title}>
      <Link href="/creator/money" className="money-sub__back">
        ← Money
      </Link>
      <h1 className="money-sub__title">{title}</h1>
      <p className="money-sub__body">{body}</p>
      {cta && cta.length > 0 ? (
        <div className="money-sub__cta-row">
          {cta.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`money-sub__cta money-sub__cta--${c.variant ?? "primary"}`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      ) : null}
      {children}
    </main>
  );
}

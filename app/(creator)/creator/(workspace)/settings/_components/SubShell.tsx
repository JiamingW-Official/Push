/**
 * Shared shell for /creator/settings/<cell> sub-routes. Each sub-route
 * passes title + body + (optional) legacy link. Until each section is
 * fully migrated to the hub structure, the legacy /profile / /wallet /
 * /disputes pages remain reachable via these CTAs.
 */

import Link from "next/link";
import "../settings.css";

export type SubShellProps = {
  /** Magvix Italic page title. */
  title: string;
  /** 1-3 sentence intro. */
  body: string;
  /** CTA href + label. Most sub-routes link to the canonical legacy page. */
  cta?: { href: string; label: string };
};

export function SubShell({ title, body, cta }: SubShellProps) {
  return (
    <main className="set-sub" aria-label={title}>
      <Link href="/creator/settings" className="set-sub__back">
        ← Settings
      </Link>
      <h1 className="set-sub__title">{title}</h1>
      <p className="set-sub__body">{body}</p>
      {cta ? (
        <Link href={cta.href} className="set-sub__cta">
          {cta.label}
        </Link>
      ) : null}
    </main>
  );
}

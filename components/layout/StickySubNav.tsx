"use client";

import { useEffect, useState } from "react";
import "./StickySubNav.css";

export interface StickySubNavProps {
  links: Array<{
    id: string;
    label: string;
  }>;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function StickySubNav({
  links,
  ctaLabel,
  ctaHref,
}: StickySubNavProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const ids = links.map((l) => l.id);
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [links]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="sticky-subnav" aria-label="Page sections">
      <div className="sticky-subnav__inner">
        <ul className="sticky-subnav__links" role="list">
          {links.map((link) => (
            <li key={link.id}>
              <button
                className={`subnav-link${activeId === link.id ? " subnav-link--active" : ""}`}
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
        {ctaLabel && ctaHref && (
          <a href={ctaHref} className="subnav-cta">
            {ctaLabel}
          </a>
        )}
      </div>
    </nav>
  );
}

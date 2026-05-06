"use client";

import Link from "next/link";
import { Button } from "@/lib/workspace/buttons";
import type { HeroLine } from "@/lib/today/briefing";

interface HeroBriefProps {
  greeting: string;
  dateLine: string;
  hero: HeroLine | null;
}

export default function HeroBrief({
  greeting,
  dateLine,
  hero,
}: HeroBriefProps) {
  return (
    <section className="hero-block">
      <p className="hero-eyebrow" suppressHydrationWarning>
        {dateLine.toUpperCase()}
      </p>
      <h1 className="hero-greeting" suppressHydrationWarning>
        {greeting}
      </h1>
      <p className="hero-line" suppressHydrationWarning>
        {hero?.text ?? ""}
      </p>
      {hero?.ctaHref && (
        <Link href={hero.ctaHref}>
          <Button variant="primary">{hero.ctaLabel}</Button>
        </Link>
      )}
      <hr className="hero-divider" />
    </section>
  );
}

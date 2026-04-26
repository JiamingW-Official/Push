"use client";

/* Repo target: components/creator/dashboard/PulsePill.tsx
   Single pill in the page header — answers PULSE CHECK (0-2 sec). */

import Link from "next/link";

export type PulseTone = "default" | "urgent" | "success" | "ceremony";

export interface PulsePillProps {
  href: string;
  icon: string;       // emoji or short glyph; could be replaced with svg later
  label: string;      // e.g. "1 today", "$25 settled"
  tone?: PulseTone;
}

export function PulsePill({ href, icon, label, tone = "default" }: PulsePillProps) {
  const className =
    "dh-pulse" + (tone !== "default" ? ` dh-pulse--${tone}` : "");

  return (
    <Link href={href} className={className}>
      <span className="dh-pulse__icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

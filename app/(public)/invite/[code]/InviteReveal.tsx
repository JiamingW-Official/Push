"use client";

import { useEffect } from "react";

interface InviteRevealProps {
  refCode: string;
}

/**
 * Client boundary for two responsibilities:
 * 1. Set push-ref-code cookie so downstream signup pages can record attribution.
 * 2. Trigger scroll-reveal animation via IntersectionObserver.
 */
export default function InviteReveal({ refCode }: InviteRevealProps) {
  useEffect(() => {
    // Set referral attribution cookie (30-day expiry)
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `push-ref-code=${encodeURIComponent(refCode)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

    // Scroll reveal — IntersectionObserver on .invite-reveal elements
    const elements = document.querySelectorAll<HTMLElement>(".invite-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [refCode]);

  return null;
}

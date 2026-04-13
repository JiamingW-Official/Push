"use client";

import { useEffect } from "react";

export default function LandingInteractivity() {
  useEffect(() => {
    // ── Hero spotlight ──────────────────────────────────────
    const hero = document.querySelector<HTMLElement>(".hero");
    let spotlight: HTMLDivElement | null = null;

    if (hero) {
      spotlight = document.createElement("div");
      spotlight.className = "hero-spotlight";
      hero.appendChild(spotlight);

      const onMove = (e: MouseEvent) => {
        if (!spotlight) return;
        const rect = hero.getBoundingClientRect();
        if (e.clientY > rect.bottom + 20) return;
        spotlight.style.setProperty("--sx", `${e.clientX - rect.left}px`);
        spotlight.style.setProperty("--sy", `${e.clientY - rect.top}px`);
        spotlight.style.opacity = "1";
      };

      const onLeave = () => {
        if (spotlight) spotlight.style.opacity = "0";
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      hero.addEventListener("mouseleave", onLeave);

      const cleanup1 = () => {
        window.removeEventListener("mousemove", onMove);
        hero.removeEventListener("mouseleave", onLeave);
        spotlight?.remove();
      };

      // ── Magnetic buttons ────────────────────────────────────
      const magnets = document.querySelectorAll<HTMLElement>(
        ".hero-ctas .btn, [data-magnetic]",
      );
      const cleanups: (() => void)[] = [cleanup1];

      magnets.forEach((btn) => {
        const onBtnMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
          btn.style.transition = "transform 100ms ease";
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        };
        const onBtnLeave = () => {
          btn.style.transition =
            "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)";
          btn.style.transform = "";
        };
        btn.addEventListener("mousemove", onBtnMove);
        btn.addEventListener("mouseleave", onBtnLeave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", onBtnMove);
          btn.removeEventListener("mouseleave", onBtnLeave);
          btn.style.transform = "";
          btn.style.transition = "";
        });
      });

      // ── Hero headline parallax ──────────────────────────────
      const headline = document.querySelector<HTMLElement>(".hero-headline");
      if (headline) {
        const onScroll = () => {
          const scrollY = window.scrollY;
          const scale = Math.max(0.92, 1 - scrollY * 0.00008);
          const opacity = Math.max(0.3, 1 - scrollY * 0.001);
          headline.style.transform = `scale(${scale})`;
          headline.style.opacity = String(opacity);
          headline.style.transformOrigin = "left center";
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("scroll", onScroll);
          headline.style.transform = "";
          headline.style.opacity = "";
          headline.style.transformOrigin = "";
        });
      }

      return () => cleanups.forEach((fn) => fn());
    }
  }, []);

  return null;
}

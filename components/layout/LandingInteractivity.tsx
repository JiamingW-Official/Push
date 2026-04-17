"use client";

import { useEffect } from "react";

export default function LandingInteractivity() {
  useEffect(() => {
    // Disable all pointer-only effects on touch devices
    const isTouch = window.matchMedia("(hover: none)").matches;

    // ── Hero spotlight ──────────────────────────────────────
    const hero = document.querySelector<HTMLElement>(".hero");
    let spotlight: HTMLDivElement | null = null;

    if (hero && !isTouch) {
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
      // Hero CTAs use existing .btn selector; global .btn-primary / .btn-ghost
      // get the proximity-based 60px magnetic zone at strength 0.3
      const heroMagnets = document.querySelectorAll<HTMLElement>(
        ".hero-ctas .btn, [data-magnetic]",
      );
      const globalMagnets = document.querySelectorAll<HTMLElement>(
        ".btn-primary, .btn-ghost",
      );
      const cleanups: (() => void)[] = [cleanup1];

      const attachMagnetic = (
        btn: HTMLElement,
        strength: number,
        radius: number,
      ) => {
        const onBtnMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          if (dist > radius) return;
          const dx = (e.clientX - cx) * strength;
          const dy = (e.clientY - cy) * strength;
          btn.style.transition = "transform 100ms ease";
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        };
        const onBtnLeave = () => {
          btn.style.transition =
            "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)";
          btn.style.transform = "translate(0,0)";
        };
        btn.addEventListener("mousemove", onBtnMove);
        btn.addEventListener("mouseleave", onBtnLeave);
        return () => {
          btn.removeEventListener("mousemove", onBtnMove);
          btn.removeEventListener("mouseleave", onBtnLeave);
          btn.style.transform = "";
          btn.style.transition = "";
        };
      };

      heroMagnets.forEach((btn) => {
        cleanups.push(attachMagnetic(btn, 0.28, 80));
      });

      globalMagnets.forEach((btn) => {
        // Skip buttons already handled by heroMagnets to avoid duplicate listeners
        if (btn.closest(".hero-ctas")) return;
        cleanups.push(attachMagnetic(btn, 0.3, 60));
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

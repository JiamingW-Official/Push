"use client";

import { useEffect } from "react";

export default function LandingInteractivity() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    let spotlight: HTMLDivElement | null = null;
    const cleanups: (() => void)[] = [];

    if (hero) {
      // ── Hero spotlight ──────────────────────────────────────
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

      cleanups.push(() => {
        window.removeEventListener("mousemove", onMove);
        hero.removeEventListener("mouseleave", onLeave);
        spotlight?.remove();
      });
    }

    // ── Magnetic buttons — all .btn-fill and .btn-outline-light ──
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
        btn.style.transition = "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)";
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

    // Hero buttons: stronger magnetic
    document
      .querySelectorAll<HTMLElement>(".hero-ctas a")
      .forEach((btn) => cleanups.push(attachMagnetic(btn, 0.25, 80)));

    // All other buttons: subtle magnetic
    document
      .querySelectorAll<HTMLElement>(
        ".btn-fill, .btn-outline, .btn-outline-light",
      )
      .forEach((btn) => {
        if (btn.closest(".hero-ctas")) return;
        cleanups.push(attachMagnetic(btn, 0.15, 50));
      });

    // ── Hero headline scroll parallax ──────────────────────────
    const heroH = document.querySelector<HTMLElement>(".hero-h");
    if (heroH) {
      const onScroll = () => {
        const y = window.scrollY;
        const opacity = Math.max(0.3, 1 - y * 0.0012);
        const translateY = y * 0.15;
        heroH.style.transform = `translateY(${translateY}px)`;
        heroH.style.opacity = String(opacity);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        heroH.style.transform = "";
        heroH.style.opacity = "";
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

// Handles tab switching for both hero and steps sections.
// Manages data-tab-group="hero" and data-tab-group="steps" independently.
export default function HowItWorksClient() {
  useEffect(() => {
    function handleTabClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLButtonElement>("[data-tab]");
      if (!btn) return;

      const group = btn.dataset.tabGroup;
      const tab = btn.dataset.tab;
      if (!group || !tab) return;

      // Update tab buttons within this group
      document
        .querySelectorAll<HTMLButtonElement>(`[data-tab-group="${group}"]`)
        .forEach((el) => {
          if (el.tagName === "BUTTON") {
            const isActive = el.dataset.tab === tab;
            el.classList.toggle("active", isActive);
            el.setAttribute("aria-selected", String(isActive));
          }
        });

      // Hero group: swap sub-copy paragraphs
      if (group === "hero") {
        document
          .querySelectorAll<HTMLElement>("[data-hero-content]")
          .forEach((el) => {
            el.style.display = el.dataset.heroContent === tab ? "" : "none";
          });
      }

      // Steps group: swap panels
      if (group === "steps") {
        document
          .querySelectorAll<HTMLElement>("[data-panel-group='steps']")
          .forEach((el) => {
            el.classList.toggle("active", el.dataset.panel === tab);
          });
      }
    }

    document.addEventListener("click", handleTabClick);
    return () => document.removeEventListener("click", handleTabClick);
  }, []);

  return null;
}

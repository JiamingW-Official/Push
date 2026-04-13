"use client";

import { useEffect } from "react";

// Adds .visible to every .reveal element when it enters the viewport.
// Uses MutationObserver to catch elements added after initial render
// (e.g. tier cards, pricing cards rendered by child components).
export default function ScrollRevealInit() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    // Observe a single element, skip if already visible.
    function observe(el: Element) {
      if (!el.classList.contains("visible")) {
        io.observe(el);
      }
    }

    // Observe all .reveal elements already in the DOM.
    document.querySelectorAll<HTMLElement>(".reveal").forEach(observe);

    // Watch for .reveal elements added later (lazy / client-rendered sections).
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          // The node itself may be a .reveal element.
          if (node.classList.contains("reveal")) observe(node);
          // Or it may contain .reveal descendants.
          node.querySelectorAll<HTMLElement>(".reveal").forEach(observe);
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

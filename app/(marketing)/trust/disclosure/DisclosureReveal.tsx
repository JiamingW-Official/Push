"use client";

import { useEffect } from "react";

/**
 * Scroll reveal controller for /trust/disclosure.
 * Adds `.is-visible` to `.dis-reveal` elements as they enter the viewport.
 */
export default function DisclosureReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    document
      .querySelectorAll<HTMLElement>(".dis-reveal")
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}

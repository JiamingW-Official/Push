"use client";

import { useEffect } from "react";

/**
 * Scroll reveal controller for /trust/risk-register.
 * Adds `.is-visible` to `.rr-reveal` elements as they enter the viewport.
 */
export default function RiskReveal() {
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
      .querySelectorAll<HTMLElement>(".rr-reveal")
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}

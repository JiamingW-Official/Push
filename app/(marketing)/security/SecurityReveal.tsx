"use client";

import { useEffect } from "react";

// Adds .is-visible to every .sec-reveal element when it enters the viewport.
export default function SecurityReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    document
      .querySelectorAll<HTMLElement>(".sec-reveal")
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}

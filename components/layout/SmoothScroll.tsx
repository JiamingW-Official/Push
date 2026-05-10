"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// Routes that must NOT get Lenis: fan-facing mobile pages and staff demo
// terminals. Lenis sets html{overflow:hidden} which clips content on iOS
// Safari and can cause the page to appear all-black.
const NO_LENIS_PREFIXES = ["/r/", "/demo/terminal", "/demo/campaigns"];

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const skipLenis = NO_LENIS_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (skipLenis) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [skipLenis]);

  return <>{children}</>;
}

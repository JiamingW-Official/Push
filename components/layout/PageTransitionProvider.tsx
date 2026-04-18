"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import "./PageTransitionProvider.css";

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Step 1: snap to "entering" state — invisible, shifted down
    el.dataset.state = "entering";

    // Step 2: after two frames (guarantees browser painted entering state),
    // switch to "visible" which triggers the CSS transition
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        el.dataset.state = "visible";
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return (
    <div
      ref={wrapperRef}
      className="pt-wrapper"
      data-state="visible"
      id="main-content"
    >
      {children}
    </div>
  );
}

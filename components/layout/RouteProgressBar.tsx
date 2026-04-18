"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./RouteProgressBar.css";

export default function RouteProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let alive = true;

    // Reset and start
    setProgress(0);
    setVisible(true);

    // Quick jump to 70% — feels like instant
    const t1 = setTimeout(() => alive && setProgress(70), 15);
    // Slow crawl to 88%
    const t2 = setTimeout(() => alive && setProgress(88), 350);
    // Complete
    const t3 = setTimeout(() => alive && setProgress(100), 650);
    // Fade out and hide
    const t4 = setTimeout(() => alive && setVisible(false), 950);

    return () => {
      alive = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="rpb" aria-hidden="true" role="presentation">
      <div
        className="rpb__bar"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}

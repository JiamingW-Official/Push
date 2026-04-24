"use client";
import { useEffect, useState } from "react";
import styles from "./MobileStickyBar.module.css";

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling 400px (past hero)
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`${styles.bar} ${visible ? styles.barVisible : ""}`}
      aria-hidden={!visible}
    >
      <a href="/for-merchants" className={styles.btnMerchant}>
        For Businesses
      </a>
      <a href="/for-creators" className={styles.btnCreator}>
        For Creators
      </a>
    </div>
  );
}

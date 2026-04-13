"use client";

import styles from "./Footer.module.css";

export default function WaitlistForm() {
  return (
    <form className={styles.waitlistForm} onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="your@email.com"
        className={styles.waitlistInput}
        aria-label="Email for early access"
      />
      <button type="submit" className={styles.waitlistBtn}>
        Join Waitlist
      </button>
    </form>
  );
}

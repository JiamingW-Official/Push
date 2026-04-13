"use client";
import { useEffect, useState } from "react";
import "./demo-banner.css";

export function DemoBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const cookie = document.cookie;
    if (cookie.includes("push-demo-role=")) {
      setVisible(true);
    }
  }, []);

  function handleExit() {
    document.cookie = "push-demo-role=; path=/; max-age=0";
    window.location.assign("/");
  }

  if (!visible || dismissed) return null;

  return (
    <div className="demo-banner" role="status" aria-label="Preview mode active">
      <div className="demo-banner__inner">
        <span className="demo-banner__dot" aria-hidden="true" />
        <span className="demo-banner__label">Preview Mode</span>
        <span className="demo-banner__sep" aria-hidden="true" />
        <span className="demo-banner__hint">
          Exploring with sample data — no real account needed
        </span>
      </div>
      <div className="demo-banner__actions">
        <button
          className="demo-banner__sign-up"
          onClick={() => window.location.assign("/creator/signup")}
        >
          Create account
        </button>
        <button
          className="demo-banner__exit"
          onClick={handleExit}
          aria-label="Exit preview mode"
        >
          Exit
        </button>
        <button
          className="demo-banner__dismiss"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}

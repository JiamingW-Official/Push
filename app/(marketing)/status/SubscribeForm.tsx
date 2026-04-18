"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Stub: would POST to /api/status/subscribe in production
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p
        style={{
          fontFamily: "'CSGenioMono', monospace",
          fontSize: "13px",
          color: "rgba(255,255,255,0.7)",
          margin: 0,
          padding: "12px 0",
        }}
      >
        ✓ Subscribed. You&apos;ll receive updates at{" "}
        <strong style={{ color: "#fff" }}>{email}</strong>.
      </p>
    );
  }

  return (
    <form
      className="subscribe-form"
      onSubmit={handleSubmit}
      aria-label="Subscribe to status updates"
    >
      <label
        htmlFor="subscribe-email"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
        }}
      >
        Email address
      </label>
      <input
        id="subscribe-email"
        type="email"
        className="subscribe-input"
        placeholder="your@email.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="subscribe-btn">
        Subscribe
      </button>
    </form>
  );
}

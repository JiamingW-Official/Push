"use client";

import { useState } from "react";

type Channel = "email" | "rss" | "webhook";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Channel-specific validation
    if (channel === "email" && !email) return;
    if (channel === "webhook" && !email) return; // webhook URL reuses the input
    // Stub: would POST to /api/status/subscribe in production
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="status-subscribe__success"
        role="status"
        aria-live="polite"
      >
        <span className="status-subscribe__success-icon" aria-hidden="true">
          ✓
        </span>
        <div className="status-subscribe__success-text">
          {channel === "email" && (
            <>
              Subscribed. Status updates will arrive at <strong>{email}</strong>
              .
            </>
          )}
          {channel === "rss" && (
            <>
              Copy the RSS URL below into your reader.
              <br />
              <code className="status-subscribe__success-url">
                https://push.nyc/api/status.rss
              </code>
            </>
          )}
          {channel === "webhook" && (
            <>
              Webhook registered. Incident events will POST to{" "}
              <strong>{email}</strong>.
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      className="status-subscribe__form"
      onSubmit={handleSubmit}
      aria-label="Subscribe to status updates"
    >
      {/* Channel selector — pill tabs */}
      <div
        className="status-subscribe__channels"
        role="radiogroup"
        aria-label="Delivery channel"
      >
        {(
          [
            { id: "email", label: "Email" },
            { id: "rss", label: "RSS" },
            { id: "webhook", label: "Webhook" },
          ] as { id: Channel; label: string }[]
        ).map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={channel === c.id}
            className={`status-subscribe__channel${
              channel === c.id ? " is-active" : ""
            }`}
            onClick={() => setChannel(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Input + CTA depending on channel */}
      {channel === "rss" ? (
        <div className="status-subscribe__rss">
          <code className="status-subscribe__rss-url">
            https://push.nyc/api/status.rss
          </code>
          <button
            type="submit"
            className="status-subscribe__submit"
            aria-label="Confirm RSS subscription"
          >
            Copy URL
          </button>
        </div>
      ) : (
        <div className="status-subscribe__input-row">
          <label
            htmlFor="status-subscribe-input"
            className="status-subscribe__visually-hidden"
          >
            {channel === "email" ? "Email address" : "Webhook URL"}
          </label>
          <input
            id="status-subscribe-input"
            type={channel === "email" ? "email" : "url"}
            className="status-subscribe__input"
            placeholder={
              channel === "email"
                ? "your@email.com"
                : "https://your.app/push-hook"
            }
            autoComplete={channel === "email" ? "email" : "off"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="status-subscribe__submit">
            Subscribe
          </button>
        </div>
      )}

      <p className="status-subscribe__note">
        One message per incident — never marketing. Unsubscribe from any
        delivery.
      </p>
    </form>
  );
}

"use client";

/* ============================================================
   /creator/settings/notifications — preference center.

   P2 audit: Web Push subscription + per-channel preference toggles.
   The push-subscribe API already exists at /api/creator/push-subscribe
   (see prompt 4). This page is the UI that drives Notification.requestPermission()
   then POSTs the subscription endpoint to that route.
   ============================================================ */

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/shared/primitives";
import "../settings.css";
import "./notifications.css";

type PrefKey =
  | "emailDigestDaily"
  | "emailDigestWeekly"
  | "pushImminentShoot"
  | "pushPayoutReceived"
  | "pushBrandMessage"
  | "smsCriticalOnly";

type Pref = {
  key: PrefKey;
  label: string;
  description: string;
  channel: "email" | "push" | "sms";
  defaultEnabled: boolean;
};

const PREFS: Pref[] = [
  {
    key: "emailDigestDaily",
    label: "Daily email digest",
    description: "Yesterday's scans + new invites + payouts. 8am ET.",
    channel: "email",
    defaultEnabled: true,
  },
  {
    key: "emailDigestWeekly",
    label: "Weekly recap",
    description:
      "Earnings + tier change + leaderboard rank for the week. Sunday 6pm.",
    channel: "email",
    defaultEnabled: false,
  },
  {
    key: "pushImminentShoot",
    label: "Imminent shoot",
    description: "Pings 1 hour before any accepted gig's shoot window opens.",
    channel: "push",
    defaultEnabled: true,
  },
  {
    key: "pushPayoutReceived",
    label: "Payout received",
    description: "Fires when a payout clears to your linked account.",
    channel: "push",
    defaultEnabled: true,
  },
  {
    key: "pushBrandMessage",
    label: "Brand message",
    description: "Whenever a brand replies to a thread you're in.",
    channel: "push",
    defaultEnabled: false,
  },
  {
    key: "smsCriticalOnly",
    label: "SMS · critical only",
    description: "Texts for failed payouts + verification holds. No marketing.",
    channel: "sms",
    defaultEnabled: false,
  },
];

type PushPermission = "default" | "granted" | "denied" | "unsupported";

export default function NotificationsPrefs() {
  const [prefs, setPrefs] = useState<Record<PrefKey, boolean>>(() =>
    PREFS.reduce(
      (acc, p) => {
        acc[p.key] = p.defaultEnabled;
        return acc;
      },
      {} as Record<PrefKey, boolean>,
    ),
  );

  const [pushPermission, setPushPermission] =
    useState<PushPermission>("default");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPushPermission("unsupported");
      return;
    }
    setPushPermission(Notification.permission as PushPermission);
  }, []);

  function toggle(key: PrefKey) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function enablePush() {
    if (pushPermission === "unsupported" || pushPermission === "denied") return;
    setSubscribing(true);
    try {
      const perm = await Notification.requestPermission();
      setPushPermission(perm as PushPermission);
      if (perm !== "granted") return;

      /* Real flow: register service worker, getPushSubscription with VAPID key,
         POST to /api/creator/push-subscribe. The push API already exists from
         prompt P0-4. The PushManager + service-worker registration comes when
         /public/sw.js is built (separate prompt). For now we just fire the
         permission flow so the OS-level prompt UX is correct. */
      console.info(
        "[push] permission granted; subscription flow pending sw.js",
      );
    } finally {
      setSubscribing(false);
    }
  }

  const pushAvailable =
    pushPermission !== "unsupported" && pushPermission !== "denied";
  const pushEnabled = pushPermission === "granted";

  return (
    <main className="notif-prefs" aria-label="Notification preferences">
      <Link href="/creator/settings" className="set-sub__back">
        ← Settings
      </Link>
      <h1 className="set-sub__title">Notifications</h1>
      <p className="set-sub__body">
        Email digest cadence, web push, imminent reminders, payout alerts, and
        SMS for critical events. Push notifications need a one-time browser
        permission grant.
      </p>

      {/* ── Push enrollment banner ───────────────────────────── */}
      <section className="notif-push-banner" aria-label="Push notifications">
        <div className="notif-push-banner__head">
          <h2>Web push</h2>
          {pushPermission === "unsupported" ? (
            <StatusPill variant="neutral" label="Browser doesn't support" />
          ) : pushPermission === "denied" ? (
            <StatusPill variant="red" label="Blocked in browser" dot />
          ) : pushPermission === "granted" ? (
            <StatusPill variant="green" label="Enabled" dot />
          ) : (
            <StatusPill variant="amber" label="Not enabled" />
          )}
        </div>
        <p className="notif-push-banner__body">
          {pushPermission === "denied"
            ? "You blocked notifications for this site. Re-enable from your browser address-bar lock icon → Notifications → Allow."
            : pushEnabled
              ? "Push is on. Toggle individual events below — Push will only send what you've opted into."
              : "One-tap enrollment. Push fires for time-sensitive events: shoot reminders, payout receipts, brand messages."}
        </p>
        {!pushEnabled && pushAvailable ? (
          <button
            type="button"
            className="notif-push-banner__cta"
            onClick={enablePush}
            disabled={subscribing}
          >
            {subscribing ? "Enrolling…" : "Enable web push"}
          </button>
        ) : null}
      </section>

      {/* ── Preference rows grouped by channel ───────────────── */}
      <section className="notif-section" aria-label="Email preferences">
        <h2 className="notif-h2">Email</h2>
        <ul className="notif-prefs-list" role="list">
          {PREFS.filter((p) => p.channel === "email").map((p) => (
            <PrefRow
              key={p.key}
              pref={p}
              enabled={prefs[p.key]}
              onToggle={toggle}
            />
          ))}
        </ul>
      </section>

      <section className="notif-section" aria-label="Push preferences">
        <h2 className="notif-h2">Push</h2>
        <ul className="notif-prefs-list" role="list">
          {PREFS.filter((p) => p.channel === "push").map((p) => (
            <PrefRow
              key={p.key}
              pref={p}
              enabled={prefs[p.key] && pushEnabled}
              disabled={!pushEnabled}
              onToggle={toggle}
            />
          ))}
        </ul>
        {!pushEnabled ? (
          <p className="notif-section__hint">
            Enable web push above to activate these toggles.
          </p>
        ) : null}
      </section>

      <section className="notif-section" aria-label="SMS preferences">
        <h2 className="notif-h2">SMS</h2>
        <ul className="notif-prefs-list" role="list">
          {PREFS.filter((p) => p.channel === "sms").map((p) => (
            <PrefRow
              key={p.key}
              pref={p}
              enabled={prefs[p.key]}
              onToggle={toggle}
            />
          ))}
        </ul>
        <p className="notif-section__hint">
          Standard message rates apply. SMS only for failed payouts +
          verification holds.
        </p>
      </section>
    </main>
  );
}

function PrefRow({
  pref,
  enabled,
  disabled = false,
  onToggle,
}: {
  pref: Pref;
  enabled: boolean;
  disabled?: boolean;
  onToggle: (k: PrefKey) => void;
}) {
  return (
    <li className={`notif-pref-row${disabled ? " is-disabled" : ""}`}>
      <div className="notif-pref-row__body">
        <span className="notif-pref-row__label">{pref.label}</span>
        <span className="notif-pref-row__desc">{pref.description}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`Toggle ${pref.label}`}
        className={`notif-toggle${enabled ? " is-on" : ""}`}
        disabled={disabled}
        onClick={() => onToggle(pref.key)}
      >
        <span className="notif-toggle__thumb" aria-hidden />
      </button>
    </li>
  );
}

"use client";

/*
 * /my-privacy — Consumer self-serve privacy surface (v5.3).
 *
 * Implements /spec/consent-privacy-v1.md § 3.4 "Your Rights" so consumers
 * can: view their current consent tier, change it, export locally-held
 * data, request deletion, and file a formal DSAR. Without this surface
 * CCPA § 1798.105/.110 rights are not meaningfully exercisable from the
 * browser — the scan-page ConsentPicker only handles first-contact.
 *
 * All localStorage access is guarded with `typeof window !== "undefined"`
 * or wrapped in useEffect so SSR (App Router) doesn't throw on build.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ConsentPicker from "@/components/customer/ConsentPicker";
import {
  getConsentTier,
  setConsentTier,
  type ConsentTier,
} from "@/lib/attribution/consent";
import styles from "./MyPrivacy.module.css";

/* ── LocalStorage helpers (client-only) ────────────────────── */

// Timestamp key mirrors the consent-tier key naming so we can persist
// "setAt" next to the tier without breaking the existing consent API.
const SET_AT_PREFIX = "push_consent_tier_setAt";

function setAtKey(qrId: string): string {
  return `${SET_AT_PREFIX}_${qrId}`;
}

function readSetAt(qrId: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(setAtKey(qrId));
}

function writeSetAt(qrId: string, iso: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(setAtKey(qrId), iso);
}

// Pulls every `push_*` localStorage entry. Used by export + delete.
function readAllPushEntries(): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof window === "undefined") return out;
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const k = window.localStorage.key(i);
    if (!k || !k.startsWith("push_")) continue;
    const v = window.localStorage.getItem(k);
    if (v !== null) out[k] = v;
  }
  return out;
}

function clearAllPushEntries(): number {
  if (typeof window === "undefined") return 0;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith("push_")) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
  return keys.length;
}

/* ── DSAR payload type (matches /api/privacy/dsar) ─────────── */

type DsarRequestType =
  | "access"
  | "deletion"
  | "correction"
  | "opt_out_of_sale"
  | "portability"
  | "restriction"
  | "other";

interface DsarSuccess {
  ticket_id: string;
  received_at: string;
  sla: string;
  next_step: string;
}

interface DsarResponse {
  data?: DsarSuccess;
  error?: string;
  trace_id?: string;
}

async function submitDsar(payload: {
  email: string;
  request_type: DsarRequestType;
  jurisdiction?: string;
  details?: string;
  consent_ack: boolean;
}): Promise<DsarResponse> {
  const res = await fetch("/api/privacy/dsar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = (await res.json().catch(() => ({}))) as DsarResponse;
  return json;
}

/* ── Page component ───────────────────────────────────────── */

export default function MyPrivacyPage() {
  const searchParams = useSearchParams();
  // Per spec: ?qr=xxx = per-QR tier; absent = synthetic "global" key.
  const qrId = searchParams.get("qr") ?? "global";

  // Current consent state is hydrated in useEffect to avoid SSR mismatch
  // (localStorage is undefined at build time).
  const [currentTier, setCurrentTier] = useState<ConsentTier | null>(null);
  const [setAt, setSetAtState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [confirmation, setConfirmation] = useState<string | null>(null);

  // DSAR form local state
  const [formEmail, setFormEmail] = useState("");
  const [formType, setFormType] = useState<DsarRequestType>("access");
  const [formJurisdiction, setFormJurisdiction] = useState("");
  const [formDetails, setFormDetails] = useState("");
  const [formAck, setFormAck] = useState(false);
  const [formStatus, setFormStatus] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "success"; ticket: DsarSuccess }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  // Deletion flow status (separate from DSAR form — section 4 auto-submits)
  const [deleteStatus, setDeleteStatus] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "success"; ticket: DsarSuccess; cleared: number }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  useEffect(() => {
    setCurrentTier(getConsentTier(qrId));
    setSetAtState(readSetAt(qrId));
    setHydrated(true);
  }, [qrId]);

  const scopeLabel = useMemo(
    () =>
      qrId === "global" ? "Default for future scans" : `For QR code ${qrId}`,
    [qrId],
  );

  /* ── Handlers ────────────────────────────────────────────── */

  const handleContinue = (tier: ConsentTier) => {
    setConsentTier(qrId, tier);
    const nowIso = new Date().toISOString();
    writeSetAt(qrId, nowIso);
    setCurrentTier(tier);
    setSetAtState(nowIso);
    setConfirmation(`Saved. Future scans will default to Tier ${tier}.`);
    // Auto-dismiss the banner after a few seconds for visual cleanliness.
    window.setTimeout(() => setConfirmation(null), 6000);
  };

  const handleExport = () => {
    const entries = readAllPushEntries();

    // Flatten push_consent_tier_* entries into something human-readable.
    const consentByQr: Record<string, { tier: string; setAt: string | null }> =
      {};
    for (const [k, v] of Object.entries(entries)) {
      if (k.startsWith("push_consent_tier_setAt_")) continue;
      if (k.startsWith("push_consent_tier_")) {
        const rawQr = k.slice("push_consent_tier_".length);
        consentByQr[rawQr] = {
          tier: v,
          setAt: entries[`push_consent_tier_setAt_${rawQr}`] ?? null,
        };
      }
    }

    // Parse push_attribution_events if present; pass through other keys raw.
    let attributionEvents: unknown = null;
    if (entries.push_attribution_events) {
      try {
        attributionEvents = JSON.parse(entries.push_attribution_events);
      } catch {
        attributionEvents = entries.push_attribution_events;
      }
    }

    const bundle = {
      exported_at: new Date().toISOString(),
      scope: "Local browser storage only",
      note:
        "This export contains data stored locally in your browser. " +
        "Server-side records (scan history, transactions) require a formal " +
        "data access request — use Section 5 below to submit one.",
      consent_tiers: consentByQr,
      attribution_events: attributionEvents,
      raw_localstorage: entries,
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `push-my-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "This will clear ALL Push data from this browser and file a formal deletion request. Continue?",
    );
    if (!confirmed) return;

    const email = window.prompt(
      "To file the formal deletion request, enter the email associated with your Push activity:",
    );
    if (!email) {
      setDeleteStatus({
        kind: "error",
        message:
          "Deletion cancelled — an email address is required to file a CCPA deletion request.",
      });
      return;
    }

    const cleared = clearAllPushEntries();
    // Reflect cleared state immediately.
    setCurrentTier(2);
    setSetAtState(null);

    setDeleteStatus({ kind: "submitting" });
    try {
      const res = await submitDsar({
        email,
        request_type: "deletion",
        jurisdiction: "CA",
        consent_ack: true,
      });
      if (res.data) {
        setDeleteStatus({ kind: "success", ticket: res.data, cleared });
      } else {
        setDeleteStatus({
          kind: "error",
          message:
            res.error ??
            "Deletion request failed to submit. Please retry from Section 5 below.",
        });
      }
    } catch {
      setDeleteStatus({
        kind: "error",
        message:
          "Network error while submitting deletion request. Please retry.",
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formAck) return;
    setFormStatus({ kind: "submitting" });

    try {
      const res = await submitDsar({
        email: formEmail,
        request_type: formType,
        jurisdiction: formJurisdiction || undefined,
        details: formDetails || undefined,
        consent_ack: true,
      });
      if (res.data) {
        setFormStatus({ kind: "success", ticket: res.data });
      } else {
        setFormStatus({
          kind: "error",
          message:
            res.error ??
            "Request could not be submitted. Please check your email and try again.",
        });
      }
    } catch {
      setFormStatus({
        kind: "error",
        message: "Network error while submitting. Please retry.",
      });
    }
  };

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <span className={styles.topBarLogo}>PUSH</span>
        <span className={styles.topBarTag}>Privacy controls</span>
      </header>

      {/* Page header */}
      <section className={styles.header}>
        <p className={styles.eyebrow}>Self-serve</p>
        <h1 className={styles.title}>Your Privacy</h1>
        <p className={styles.lede}>
          Change what Push collects, export what you have, or file a formal data
          request. For the full policy see our{" "}
          <Link href="/legal/privacy" className={styles.ledeLink}>
            privacy policy
          </Link>
          .
        </p>
      </section>

      {/* ── 1. Current choice ──────────────────────────────── */}
      <section className={styles.section} aria-labelledby="s1-title">
        <p className={styles.sectionEyebrow}>01 / Your current choice</p>
        <h2 id="s1-title" className={styles.sectionTitle}>
          What we collect from you today
        </h2>
        <div className={styles.choicePanel}>
          <p className={styles.choicePanelLabel}>{scopeLabel}</p>
          <p className={styles.choicePanelTier}>
            {!hydrated
              ? "—"
              : setAt
                ? `Tier ${currentTier ?? 2}`
                : "Tier 2 (default)"}
          </p>
          <p className={styles.choicePanelMeta}>
            {!hydrated
              ? "Loading your saved preference..."
              : setAt
                ? `Last set ${new Date(setAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`
                : "Not yet set (default Tier 2)."}
          </p>
        </div>
      </section>

      {/* ── 2. Change tier via ConsentPicker ───────────────── */}
      <section className={styles.section} aria-labelledby="s2-title">
        <p className={styles.sectionEyebrow}>02 / Change your tier</p>
        <h2 id="s2-title" className={styles.sectionTitle}>
          Adjust how much we collect
        </h2>
        {confirmation && (
          <div className={styles.confirmation} role="status" aria-live="polite">
            {confirmation}
          </div>
        )}
        {hydrated && currentTier !== null && (
          <ConsentPicker
            key={`${qrId}-${currentTier}`}
            initialTier={currentTier}
            onDeclineAll={() => handleContinue(1)}
            onContinue={(tier) => handleContinue(tier)}
          />
        )}
      </section>

      {/* ── 3. Export ──────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="s3-title">
        <p className={styles.sectionEyebrow}>03 / Export my data</p>
        <h2 id="s3-title" className={styles.sectionTitle}>
          Download what we have locally
        </h2>
        <p className={styles.sectionBody}>
          Click below to download a JSON file containing every{" "}
          <code>push_*</code> key we&apos;ve stored in this browser — your
          consent tier(s) and any locally-logged attribution events. Scan
          history and transactions stored on our servers require a formal data
          access request; use Section 5 to submit one.
        </p>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleExport}
        >
          Download my data (JSON)
        </button>
      </section>

      {/* ── 4. Delete ──────────────────────────────────────── */}
      <section className={styles.section} aria-labelledby="s4-title">
        <p className={styles.sectionEyebrow}>04 / Delete my data</p>
        <h2 id="s4-title" className={styles.sectionTitle}>
          Clear this browser + file a deletion request
        </h2>
        <p className={styles.sectionBody}>
          This will erase all locally stored Push data and file a formal
          deletion request with our privacy team. You&apos;ll be asked to
          confirm and to enter the email you used with Push so we can verify
          your identity. Under CCPA we respond within 45 days.
        </p>
        <button
          type="button"
          className={styles.dangerBtn}
          onClick={handleDelete}
          disabled={deleteStatus.kind === "submitting"}
        >
          {deleteStatus.kind === "submitting"
            ? "Submitting..."
            : "Delete my data"}
        </button>
        {deleteStatus.kind === "success" && (
          <div
            className={styles.successBanner}
            role="status"
            aria-live="polite"
          >
            <p className={styles.bannerTitle}>Deletion request submitted</p>
            <p className={styles.bannerBody}>
              Cleared {deleteStatus.cleared}{" "}
              {deleteStatus.cleared === 1 ? "entry" : "entries"} from this
              browser. Ticket{" "}
              <span className={styles.bannerTicket}>
                {deleteStatus.ticket.ticket_id}
              </span>
              . {deleteStatus.ticket.next_step}
            </p>
          </div>
        )}
        {deleteStatus.kind === "error" && (
          <div
            className={styles.errorBanner}
            role="alert"
            aria-live="assertive"
          >
            <p className={styles.bannerTitle}>Something went wrong</p>
            <p className={styles.bannerBody}>{deleteStatus.message}</p>
          </div>
        )}
      </section>

      {/* ── 5. Formal DSAR form ────────────────────────────── */}
      <section className={styles.section} aria-labelledby="s5-title">
        <p className={styles.sectionEyebrow}>
          05 / Submit a formal data request
        </p>
        <h2 id="s5-title" className={styles.sectionTitle}>
          Access, correction, or portability
        </h2>
        <p className={styles.sectionBody}>
          Use this form for CCPA / GDPR requests beyond a simple deletion: full
          data access, correction of inaccurate demo fields, portability
          exports, or opting out of sale/sharing. We respond within 45 days
          (CCPA) or 30 days (GDPR). Identity verification is required before
          action.
        </p>
        <form className={styles.form} onSubmit={handleFormSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="dsar-email" className={styles.label}>
              Email
            </label>
            <input
              id="dsar-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={styles.input}
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="dsar-type" className={styles.label}>
              Request type
            </label>
            <select
              id="dsar-type"
              name="request_type"
              className={styles.select}
              value={formType}
              onChange={(e) => setFormType(e.target.value as DsarRequestType)}
            >
              <option value="access">Access — get a copy of my data</option>
              <option value="deletion">Deletion — erase my data</option>
              <option value="correction">
                Correction — fix inaccurate data
              </option>
              <option value="portability">
                Portability — machine-readable export
              </option>
              <option value="opt_out_of_sale">
                Opt out of sale / sharing (CCPA)
              </option>
              <option value="restriction">
                Restrict processing (GDPR Art. 18)
              </option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="dsar-jurisdiction" className={styles.label}>
              Jurisdiction{" "}
              <span className={styles.labelHint}>
                (optional — e.g. CA, NY, EEA)
              </span>
            </label>
            <input
              id="dsar-jurisdiction"
              name="jurisdiction"
              type="text"
              maxLength={64}
              className={styles.input}
              value={formJurisdiction}
              onChange={(e) => setFormJurisdiction(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="dsar-details" className={styles.label}>
              Details{" "}
              <span className={styles.labelHint}>
                (optional — help us find the right records)
              </span>
            </label>
            <textarea
              id="dsar-details"
              name="details"
              maxLength={4000}
              className={styles.textarea}
              value={formDetails}
              onChange={(e) => setFormDetails(e.target.value)}
            />
          </div>

          <div className={styles.checkboxRow}>
            <input
              id="dsar-ack"
              name="consent_ack"
              type="checkbox"
              required
              className={styles.checkbox}
              checked={formAck}
              onChange={(e) => setFormAck(e.target.checked)}
            />
            <label htmlFor="dsar-ack" className={styles.checkboxLabel}>
              I acknowledge Push will email me from privacy@pushnyc.co to verify
              my identity before actioning this request.
            </label>
          </div>

          <div>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={
                !formAck || !formEmail || formStatus.kind === "submitting"
              }
            >
              {formStatus.kind === "submitting"
                ? "Submitting..."
                : "Submit request"}
            </button>
          </div>

          {formStatus.kind === "success" && (
            <div
              className={styles.successBanner}
              role="status"
              aria-live="polite"
            >
              <p className={styles.bannerTitle}>Request received</p>
              <p className={styles.bannerBody}>
                Ticket{" "}
                <span className={styles.bannerTicket}>
                  {formStatus.ticket.ticket_id}
                </span>{" "}
                — SLA: {formStatus.ticket.sla}. {formStatus.ticket.next_step}
              </p>
            </div>
          )}
          {formStatus.kind === "error" && (
            <div
              className={styles.errorBanner}
              role="alert"
              aria-live="assertive"
            >
              <p className={styles.bannerTitle}>Submission failed</p>
              <p className={styles.bannerBody}>{formStatus.message}</p>
            </div>
          )}
        </form>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Powered by{" "}
          <Link href="/" className={styles.footerLink}>
            Push
          </Link>{" "}
          — privacy questions?{" "}
          <a href="mailto:privacy@pushnyc.co" className={styles.footerLink}>
            privacy@pushnyc.co
          </a>
        </p>
      </footer>
    </div>
  );
}

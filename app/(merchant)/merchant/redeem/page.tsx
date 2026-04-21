"use client";

import { useState } from "react";

/**
 * /merchant/redeem — v5.3-EXEC P1-5 POS UI.
 *
 * A merchant-facing page staffed at the register. The merchant enters the
 * short QR code prefix the consumer's phone displays (4–8 chars), the
 * order total, picks a product category, and submits. The page calls
 * POST /api/merchant/redeem which resolves the prefix and writes one
 * push_transactions row.
 *
 * Design.md:
 *   - Darky display font for headline; CS Genio Mono for body.
 *   - Flag Red primary button; Deep Space Blue for status readouts.
 *   - 8px grid (padding multiples of 8); zero border-radius.
 */
export default function MerchantRedeemPage() {
  const [prefix, setPrefix] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("coffee");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "ok"; transactionId: string; qrId: string }
    | { kind: "err"; message: string }
  >({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    const cents = Math.round(parseFloat(amount || "0") * 100);
    if (!Number.isFinite(cents) || cents < 0) {
      setStatus({ kind: "err", message: "Invalid amount" });
      return;
    }
    try {
      const res = await fetch("/api/merchant/redeem", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prefix: prefix.trim(),
          order_total_cents: cents,
          product_category: category,
          creative_content_hash: "pos-manual-entry",
          consent_version: "v1.0",
          consent_tier: 2,
          ftc_disclosure_shown: true,
        }),
      });
      const json = (await res.json()) as {
        data?: { transaction_id: string; qr_id: string };
        error?: string;
      };
      if (!res.ok) {
        setStatus({ kind: "err", message: json.error ?? `HTTP ${res.status}` });
        return;
      }
      setStatus({
        kind: "ok",
        transactionId: json.data!.transaction_id,
        qrId: json.data!.qr_id,
      });
      setPrefix("");
      setAmount("");
    } catch (err) {
      setStatus({
        kind: "err",
        message: err instanceof Error ? err.message : "Request failed",
      });
    }
  }

  return (
    <div style={S.page}>
      <header style={S.header}>
        <p style={S.eyebrow}>MERCHANT POS</p>
        <h1 style={S.title}>Redeem a claim</h1>
        <p style={S.lede}>
          Ask the customer for the 4–8 character code shown on their phone, then
          enter the order amount below.
        </p>
      </header>

      <form onSubmit={submit} style={S.form}>
        <label style={S.label}>
          CLAIM CODE (prefix)
          <input
            autoFocus
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.trim())}
            placeholder="abcd1234"
            minLength={4}
            maxLength={36}
            required
            style={S.input}
          />
        </label>

        <label style={S.label}>
          ORDER TOTAL (USD)
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="12.00"
            inputMode="decimal"
            required
            style={S.input}
          />
        </label>

        <label style={S.label}>
          PRODUCT CATEGORY
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={S.input}
          >
            <option value="coffee">Coffee</option>
            <option value="pastry">Pastry</option>
            <option value="beverage">Beverage</option>
            <option value="meal">Meal</option>
            <option value="retail">Retail</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={status.kind === "submitting"}
          style={S.submit}
        >
          {status.kind === "submitting" ? "Submitting…" : "REDEEM →"}
        </button>
      </form>

      {status.kind === "ok" && (
        <div style={S.ok} role="status">
          <p style={S.okHead}>✓ REDEEMED</p>
          <p style={S.okLine}>
            transaction_id: <code>{status.transactionId}</code>
          </p>
          <p style={S.okLine}>
            qr_id: <code>{status.qrId}</code>
          </p>
        </div>
      )}

      {status.kind === "err" && (
        <div style={S.err} role="alert">
          <p style={S.errHead}>✗ REDEEM FAILED</p>
          <p style={S.errLine}>{status.message}</p>
        </div>
      )}
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "var(--surface)",
    color: "var(--dark)",
    fontFamily: "var(--font-body)",
    padding: "48px 24px",
    maxWidth: "640px",
    margin: "0 auto",
  } as React.CSSProperties,
  header: { marginBottom: "32px" } as React.CSSProperties,
  eyebrow: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--primary)",
    marginBottom: "8px",
  } as React.CSSProperties,
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    marginBottom: "8px",
  } as React.CSSProperties,
  lede: {
    fontSize: "14px",
    color: "var(--graphite)",
    lineHeight: 1.6,
  } as React.CSSProperties,
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    border: "1px solid var(--line)",
    background: "var(--surface-elevated)",
  } as React.CSSProperties,
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    gap: "8px",
    color: "var(--text-muted)",
  } as React.CSSProperties,
  input: {
    padding: "12px 16px",
    border: "1px solid var(--line)",
    background: "var(--surface)",
    color: "var(--dark)",
    fontFamily: "var(--font-body)",
    fontSize: "16px",
    fontWeight: 500,
    borderRadius: 0,
  } as React.CSSProperties,
  submit: {
    padding: "16px",
    background: "var(--primary)",
    color: "#ffffff",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    border: "none",
    borderRadius: 0,
    cursor: "pointer",
    marginTop: "8px",
  } as React.CSSProperties,
  ok: {
    marginTop: "24px",
    padding: "16px",
    border: "2px solid var(--dark)",
    background: "var(--surface-elevated)",
  } as React.CSSProperties,
  okHead: {
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 800,
    color: "var(--dark)",
    marginBottom: "8px",
  } as React.CSSProperties,
  okLine: { fontSize: "13px", marginTop: "4px" } as React.CSSProperties,
  err: {
    marginTop: "24px",
    padding: "16px",
    border: "2px solid var(--primary)",
    background: "rgba(193, 18, 31, 0.06)",
  } as React.CSSProperties,
  errHead: {
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 800,
    color: "var(--primary)",
    marginBottom: "8px",
  } as React.CSSProperties,
  errLine: { fontSize: "13px" } as React.CSSProperties,
};

"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * /merchant/redeem — v5.3-EXEC P1-5 POS UI.
 *
 * Merchant enters the short QR code prefix shown on the customer's phone,
 * the order total, picks a product category, and submits. The page calls
 * POST /api/merchant/redeem which resolves the prefix and writes one
 * push_transactions row.
 */

/* -- Recent redemption type ------------------------------------------------------- */
type RecentEntry = {
  id: string;
  code: string;
  amount: string;
  category: string;
  ts: Date;
};

/* -- Status type ------------------------------------------------------------------ */
type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok"; transactionId: string; qrId: string }
  | { kind: "err"; message: string };

export default function MerchantRedeemPage() {
  const [prefix, setPrefix] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("coffee");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [recent, setRecent] = useState<RecentEntry[]>([]);

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
      const entry: RecentEntry = {
        id: json.data!.transaction_id,
        code: prefix.trim().toUpperCase(),
        amount: `$${parseFloat(amount).toFixed(2)}`,
        category,
        ts: new Date(),
      };
      setRecent((prev) => [entry, ...prev].slice(0, 10));
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

  function resetForm() {
    setStatus({ kind: "idle" });
    setPrefix("");
    setAmount("");
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 16,
    padding: "12px 16px",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--ink)",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    height: 48,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--ink-4)",
    display: "block",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          padding: "0 64px",
          height: 56,
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link
          href="/merchant/dashboard"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            textDecoration: "none",
          }}
        >
          ← Dashboard
        </Link>
        <span
          style={{
            width: 1,
            height: 20,
            background: "var(--hairline)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
          }}
        >
          POS Redemption
        </span>
      </nav>

      {/* Content — centered single column */}
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "48px 24px 96px",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-4)",
              marginBottom: 8,
            }}
          >
            Merchant POS
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--ink)",
              margin: "0 0 12px",
            }}
          >
            Verify Visit
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-3)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Ask the customer for the 4–8 character code shown on their phone,
            then enter the order amount below.
          </p>
        </div>

        {/* Form card */}
        {status.kind !== "ok" && (
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: 32,
              marginBottom: 24,
            }}
          >
            <form
              onSubmit={submit}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              {/* Claim code */}
              <div>
                <label htmlFor="claim-code" style={labelStyle}>
                  Claim Code
                </label>
                <input
                  id="claim-code"
                  autoFocus
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.trim())}
                  placeholder="ABCD1234"
                  minLength={4}
                  maxLength={36}
                  required
                  style={{
                    ...inputStyle,
                    fontSize: 22,
                    letterSpacing: "0.12em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    height: 56,
                  }}
                />
              </div>

              {/* Order total */}
              <div>
                <label htmlFor="order-total" style={labelStyle}>
                  Order Total (USD)
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontFamily: "var(--font-body)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink-3)",
                      pointerEvents: "none",
                    }}
                  >
                    $
                  </span>
                  <input
                    id="order-total"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    inputMode="decimal"
                    required
                    style={{
                      ...inputStyle,
                      paddingLeft: 32,
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  />
                </div>
              </div>

              {/* Product category */}
              <div>
                <label htmlFor="product-category" style={labelStyle}>
                  Product Category
                </label>
                <select
                  id="product-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={inputStyle}
                >
                  <option value="coffee">Coffee</option>
                  <option value="pastry">Pastry</option>
                  <option value="beverage">Beverage</option>
                  <option value="meal">Meal</option>
                  <option value="retail">Retail</option>
                  <option value="service">Service</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Error state inline */}
              {status.kind === "err" && (
                <div
                  role="alert"
                  style={{
                    background: "rgba(193,18,31,0.06)",
                    border: "1px solid var(--brand-red)",
                    borderRadius: 8,
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--brand-red)",
                      marginBottom: 4,
                    }}
                  >
                    Verification Failed
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--brand-red)",
                      margin: 0,
                    }}
                  >
                    {status.message}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status.kind === "submitting"}
                className="click-shift"
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor:
                    status.kind === "submitting" ? "not-allowed" : "pointer",
                  borderRadius: 8,
                  border: "none",
                  background:
                    status.kind === "submitting"
                      ? "var(--ink-4)"
                      : "var(--brand-red)",
                  color: "var(--snow)",
                  transition: "transform 180ms, background 0.2s",
                  opacity: status.kind === "submitting" ? 0.7 : 1,
                  marginTop: 8,
                }}
              >
                {status.kind === "submitting" ? "Verifying…" : "Verify Visit"}
              </button>
            </form>
          </div>
        )}

        {/* Success state */}
        {status.kind === "ok" && (
          <div
            role="status"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: 32,
              marginBottom: 24,
            }}
          >
            {/* Large checkmark */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(0,133,255,0.10)",
                border: "2px solid var(--accent-blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-blue)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 16,
              }}
            >
              Visit Verified
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                { label: "Transaction ID", value: status.transactionId },
                { label: "QR Code ID", value: status.qrId },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--ink-4)",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <code
                    style={{
                      fontFamily: "var(--font-body)",
                      background: "var(--surface)",
                      border: "1px solid var(--hairline)",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "var(--ink)",
                      display: "block",
                      wordBreak: "break-all",
                    }}
                  >
                    {value}
                  </code>
                </div>
              ))}
            </div>

            <button
              onClick={resetForm}
              className="click-shift"
              style={{
                width: "100%",
                padding: "12px 24px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "none",
                background: "var(--brand-red)",
                color: "var(--snow)",
                transition: "transform 180ms",
              }}
            >
              Verify Another
            </button>
          </div>
        )}

        {/* Recent redemptions */}
        {recent.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-4)",
                marginBottom: 12,
              }}
            >
              Recent Verifications
            </div>
            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {recent.map((entry, i) => (
                <div
                  key={entry.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 16px",
                    borderBottom:
                      i < recent.length - 1
                        ? "1px solid var(--hairline)"
                        : "none",
                    background: "var(--surface)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--ink)",
                      letterSpacing: "0.08em",
                      minWidth: 80,
                    }}
                  >
                    {entry.code}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--ink)",
                      }}
                    >
                      {entry.amount}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                        textTransform: "capitalize",
                      }}
                    >
                      {entry.category}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                      flexShrink: 0,
                    }}
                  >
                    {entry.ts.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

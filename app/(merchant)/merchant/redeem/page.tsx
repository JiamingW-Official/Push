"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { EmptyState, Modal } from "@/components/merchant/shared";
import "./redeem.css";

type RedeemResult = {
  claim_id: string;
  claim_code: string;
  creator: {
    handle: string | null;
    name: string | null;
  };
  hero_offer: {
    type: string | null;
    value_text: string | null;
    value_numeric: number | null;
  };
  campaign: {
    title: string | null;
  };
  claimed_at: string;
  status: string;
  phone_last_four: string | null;
};

type Toast = {
  id: number;
  tone: "success" | "error";
  message: string;
};

type RedeemResponse = {
  ok: boolean;
  error?: string;
  visit_id?: string;
  redemption_id?: string;
  offer_remaining?: number;
  is_bonus_position?: boolean;
  bonus_reward_text?: string | null;
  bonus_reward_description?: string | null;
  position_number?: number;
  // Optional ground-truth fields (when API returns them; safe-guarded below)
  redeemed_at?: string | null;
  redeemed_by?: string | null;
};

type RecentSuccessState = {
  claimId: string;
  message: string;
  is_bonus_position?: boolean;
  bonus_reward_text?: string | null;
  bonus_reward_description?: string | null;
  position_number?: number;
};

function formatClaimedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRelativeMinutes(iso?: string | null) {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const diffMin = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (diffMin < 1) return "just now";
  if (diffMin === 1) return "1 minute ago";
  if (diffMin < 60) return `${diffMin} minutes ago`;
  const hours = Math.round(diffMin / 60);
  return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
}

function formatOffer(offer: RedeemResult["hero_offer"]) {
  switch (offer.type) {
    case "percent_off":
      return `${offer.value_numeric ?? 0}% OFF`;
    case "fixed_amount":
      return `$${offer.value_numeric ?? 0} OFF`;
    case "free_item":
      return offer.value_text ?? "FREE ITEM";
    case "bogo":
      return offer.value_text ?? "BOGO";
    default:
      return "OFFER";
  }
}

// Non-blaming error copy. Each variant: short label + supplemental hint shown
// in the toast description. Hints favor "what now" over "what's wrong".
function normalizeErrorMessage(error?: string, ctx?: RedeemResponse) {
  switch (error) {
    case "claim_not_found":
      return "NO MATCH FOUND · CHECK THE CODE";
    case "wrong_merchant":
      return "CLAIM BELONGS TO ANOTHER STORE";
    case "offer_expired":
      return "OFFER WINDOW CLOSED";
    case "offer_sold_out":
      return "OFFER SOLD OUT FOR TODAY";
    case "claim_already_redeemed": {
      const when = formatRelativeMinutes(ctx?.redeemed_at ?? null);
      const who = ctx?.redeemed_by;
      const parts = ["ALREADY REDEEMED"];
      if (when) parts.push(when.toUpperCase());
      if (who) parts.push(`BY ${who.toUpperCase()}`);
      return parts.join(" · ");
    }
    default:
      return error?.startsWith("claim_already_")
        ? "STATUS CHANGED · CAN'T REDEEM"
        : "REDEEM FAILED · TRY AGAIN";
  }
}

export default function MerchantRedeemPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RedeemResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [recentSuccess, setRecentSuccess] = useState<RecentSuccessState | null>(
    null,
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmTarget, setConfirmTarget] = useState<RedeemResult | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  const resultCountLabel = useMemo(() => {
    if (!hasQuery) return "WAITING FOR INPUT";
    if (isSearching) return "VERIFYING";
    return `${results.length} READY · ${results.length === 1 ? "SINGLE TICKET" : "MULTIPLE TICKETS"}`;
  }, [hasQuery, isSearching, results.length]);

  const verifyState: "idle" | "verifying" | "match" | "no-match" | "error" =
    useMemo(() => {
      if (!hasQuery) return "idle";
      if (isSearching) return "verifying";
      if (searchError) return "error";
      if (results.length > 0) return "match";
      return "no-match";
    }, [hasQuery, isSearching, searchError, results.length]);

  function pushToast(tone: Toast["tone"], message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, tone, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3600);
  }

  useEffect(() => {
    if (!hasQuery) {
      setResults([]);
      setSearchError(null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const response = await fetch(
          `/api/merchant/redeem/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as
          | RedeemResult[]
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            !Array.isArray(payload) && payload.error
              ? payload.error
              : "Search failed",
          );
        }

        setResults(Array.isArray(payload) ? payload : []);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setResults([]);
        setSearchError(
          error instanceof Error ? error.message : "Search failed",
        );
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [hasQuery, trimmedQuery]);

  // Keyboard: Enter on the input jumps focus to the first ready ticket's
  // CTA — no auto-redeem (still requires the second-stage confirm).
  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    if (results.length === 0) return;
    event.preventDefault();
    const firstCta =
      document.querySelector<HTMLButtonElement>("[data-redeem-cta]");
    firstCta?.focus();
  }

  async function handleRedeem(claimId: string) {
    setActiveClaimId(claimId);

    try {
      const response = await fetch("/api/merchant/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_id: claimId }),
      });

      const payload = (await response.json()) as
        | RedeemResponse
        | { error?: string };

      if (!response.ok || !("ok" in payload) || payload.ok !== true) {
        const message =
          "error" in payload
            ? normalizeErrorMessage(payload.error, payload as RedeemResponse)
            : "REDEEM FAILED · TRY AGAIN";
        setRecentSuccess(null);
        pushToast("error", message);
        return;
      }

      const body = payload;
      const isBonus = body.is_bonus_position === true;
      const successMessage = isBonus
        ? (body.bonus_reward_text ?? "BONUS DROP").toUpperCase()
        : "VERIFIED · +15 CREDIT";

      setResults((current) =>
        current.filter((item) => item.claim_id !== claimId),
      );
      setRecentSuccess({
        claimId,
        message: successMessage,
        is_bonus_position: isBonus,
        bonus_reward_text: body.bonus_reward_text ?? null,
        bonus_reward_description: body.bonus_reward_description ?? null,
        position_number: body.position_number,
      });
      pushToast("success", successMessage);

      // After success, return focus to the search input for the next customer.
      window.setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 80);
    } catch {
      setRecentSuccess(null);
      pushToast("error", "NETWORK ERROR · TRY AGAIN");
    } finally {
      setActiveClaimId(null);
    }
  }

  function openConfirm(result: RedeemResult) {
    setConfirmTarget(result);
  }

  function closeConfirm() {
    if (activeClaimId) return; // do not close mid-submit
    setConfirmTarget(null);
  }

  async function handleConfirm() {
    if (!confirmTarget) return;
    const claimId = confirmTarget.claim_id;
    await handleRedeem(claimId);
    setConfirmTarget(null);
  }

  const bonusPositionLabel =
    typeof recentSuccess?.position_number === "number"
      ? `POSITION #${recentSuccess.position_number}`
      : "POSITION #--";

  const verifyDotClass =
    verifyState === "match"
      ? "redeem-verify-dot redeem-verify-dot--match"
      : verifyState === "verifying"
        ? "redeem-verify-dot redeem-verify-dot--pending"
        : verifyState === "error" || verifyState === "no-match"
          ? "redeem-verify-dot redeem-verify-dot--alert"
          : "redeem-verify-dot";

  return (
    <div className="redeem-page">
      <header className="redeem-page-header">
        <p className="redeem-page-eyebrow">OPERATIONS · REDEEM</p>
        <h1 className="redeem-page-title">Redeem</h1>
        <p className="redeem-page-subtitle">
          Verify the customer&rsquo;s claim, confirm at the counter, complete
          the visit. Each ticket can only be redeemed once.
        </p>
      </header>

      {/* Hero ticket — Push v11 § 8.2 Ticket Panel reused for the redeem moment.
          Justified: physical-ticket semantic is the literal product here. */}
      <section className="redeem-hero" aria-labelledby="redeem-hero-title">
        <div className="redeem-ticket">
          <span
            className="redeem-ticket-grommet redeem-ticket-grommet--tl"
            aria-hidden="true"
          />
          <span
            className="redeem-ticket-grommet redeem-ticket-grommet--tr"
            aria-hidden="true"
          />
          <span
            className="redeem-ticket-grommet redeem-ticket-grommet--bl"
            aria-hidden="true"
          />
          <span
            className="redeem-ticket-grommet redeem-ticket-grommet--br"
            aria-hidden="true"
          />

          <div className="redeem-ticket-flag">
            <span className={verifyDotClass} aria-hidden="true" />
            <span className="redeem-ticket-flag-label">
              {verifyState === "verifying"
                ? "VERIFYING"
                : verifyState === "match"
                  ? "MATCH FOUND"
                  : verifyState === "no-match"
                    ? "NO MATCH"
                    : verifyState === "error"
                      ? "RETRY"
                      : "READY"}
            </span>
          </div>

          <h2 id="redeem-hero-title" className="redeem-ticket-title">
            <em>Verify.</em> Confirm. Done.
          </h2>

          <p className="redeem-ticket-subtitle">
            Enter the last 4 of the customer&rsquo;s phone or their claim code.
            Press <kbd>Enter</kbd> to jump to the action.
          </p>

          <label className="redeem-ticket-label" htmlFor="redeem-query">
            PHONE LAST 4 OR CLAIM CODE
          </label>
          <input
            id="redeem-query"
            ref={inputRef}
            className="redeem-ticket-input"
            type="text"
            inputMode="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="0000  ·  CODE"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-describedby="redeem-status-line"
          />

          <div
            id="redeem-status-line"
            className="redeem-ticket-status"
            aria-live="polite"
          >
            <span>{resultCountLabel}</span>
            {searchError ? (
              <span className="redeem-ticket-status-error">
                CONNECTION ISSUE · TRY AGAIN
              </span>
            ) : null}
          </div>
        </div>

        {recentSuccess ? (
          <div
            className={`redeem-inline-success${
              recentSuccess.is_bonus_position
                ? " redeem-inline-success--bonus"
                : ""
            }`}
            role="status"
          >
            {recentSuccess.is_bonus_position ? (
              <>
                <span className="redeem-inline-success-label">
                  BONUS DROP · {bonusPositionLabel}
                </span>
                <span className="redeem-inline-success-bonus">
                  {recentSuccess.bonus_reward_text ?? "BONUS PRIZE"}
                </span>
                {recentSuccess.bonus_reward_description ? (
                  <p className="redeem-inline-success-description">
                    {recentSuccess.bonus_reward_description}
                  </p>
                ) : null}
                <span className="redeem-inline-success-hint">
                  HAND THIS TO THE CUSTOMER
                </span>
              </>
            ) : (
              <>
                <span className="redeem-inline-success-label">LATEST</span>
                <span className="redeem-inline-success-message">
                  {recentSuccess.message}
                </span>
              </>
            )}
          </div>
        ) : null}
      </section>

      {!hasQuery ? (
        <EmptyState
          title="WAITING FOR INPUT"
          description="Type the customer's phone last 4 or their claim code. Tickets matching this store will appear below."
        />
      ) : results.length === 0 && !isSearching && !searchError ? (
        <EmptyState
          title="NO TICKETS FOUND"
          description="Nothing in claimed state matches that input. Double-check the digits with the customer, or try the claim code instead."
        />
      ) : (
        <section className="redeem-results-section" aria-live="polite">
          <div className="redeem-results-header">
            <p className="redeem-results-label">REDEEMABLE TICKETS</p>
            <p className="redeem-results-count">{results.length}</p>
          </div>

          <div className="redeem-results-list">
            {results.map((result, index) => (
              <article className="redeem-result-card" key={result.claim_id}>
                <div className="redeem-result-copy">
                  <div className="redeem-result-topline">
                    <h3 className="redeem-result-handle">
                      {result.creator.handle ??
                        result.creator.name ??
                        "Unknown creator"}
                    </h3>
                    <span className="redeem-result-time">
                      {formatClaimedAt(result.claimed_at)}
                    </span>
                  </div>

                  <p className="redeem-result-offer">
                    {formatOffer(result.hero_offer)}
                  </p>
                  <p className="redeem-result-campaign">
                    {result.campaign.title ?? "Untitled campaign"}
                  </p>

                  <dl className="redeem-result-meta">
                    <div>
                      <dt>CODE</dt>
                      <dd>{result.claim_code}</dd>
                    </div>
                    <div>
                      <dt>PHONE</dt>
                      <dd>{result.phone_last_four ?? "----"}</dd>
                    </div>
                    <div>
                      <dt>STATUS</dt>
                      <dd>
                        <span className="redeem-result-status-pill">READY</span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="redeem-result-actions">
                  <button
                    type="button"
                    className="redeem-cta"
                    data-redeem-cta={index === 0 ? "first" : undefined}
                    onClick={() => openConfirm(result)}
                    disabled={activeClaimId === result.claim_id}
                  >
                    {activeClaimId === result.claim_id
                      ? "PROCESSING"
                      : "REDEEM"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Second-stage confirmation — guards against accidental redemption. */}
      <Modal
        open={Boolean(confirmTarget)}
        onClose={closeConfirm}
        title="Confirm redemption"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="redeem-modal-ghost"
              onClick={closeConfirm}
              disabled={Boolean(activeClaimId)}
            >
              CANCEL
            </button>
            <button
              type="button"
              className="redeem-modal-confirm"
              onClick={handleConfirm}
              disabled={Boolean(activeClaimId)}
              autoFocus
            >
              {activeClaimId ? "PROCESSING" : "CONFIRM REDEEM"}
            </button>
          </>
        }
      >
        {confirmTarget ? (
          <div className="redeem-confirm-body">
            <p className="redeem-confirm-eyebrow">
              YOU&rsquo;RE ABOUT TO REDEEM
            </p>
            <p className="redeem-confirm-offer">
              {formatOffer(confirmTarget.hero_offer)}
            </p>

            <dl className="redeem-confirm-meta">
              <div>
                <dt>CREATOR</dt>
                <dd>
                  {confirmTarget.creator.handle ??
                    confirmTarget.creator.name ??
                    "Unknown"}
                </dd>
              </div>
              <div>
                <dt>CAMPAIGN</dt>
                <dd>{confirmTarget.campaign.title ?? "Untitled campaign"}</dd>
              </div>
              <div>
                <dt>CODE</dt>
                <dd>{confirmTarget.claim_code}</dd>
              </div>
              <div>
                <dt>PHONE</dt>
                <dd>{confirmTarget.phone_last_four ?? "----"}</dd>
              </div>
            </dl>

            <p className="redeem-confirm-note">
              Once confirmed, this ticket cannot be redeemed again. Make sure
              the customer is at the counter.
            </p>
          </div>
        ) : null}
      </Modal>

      <div className="redeem-toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`redeem-toast redeem-toast--${toast.tone}`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

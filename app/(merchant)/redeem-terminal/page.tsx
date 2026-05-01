"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import "./redeem-terminal.css";

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
};

type SuccessState = {
  claimId: string;
  offerRemaining: number | null;
  is_bonus_position?: boolean;
  bonus_reward_text?: string | null;
  bonus_reward_description?: string | null;
  position_number?: number;
};

function formatOffer(offer: RedeemResult["hero_offer"]) {
  if (offer.value_text) {
    return offer.value_text.toUpperCase();
  }

  switch (offer.type) {
    case "percent_off":
      return `${offer.value_numeric ?? 0}% OFF`;
    case "fixed_amount":
      return `$${offer.value_numeric ?? 0} OFF`;
    case "free_item":
      return "FREE ITEM";
    case "bogo":
      return "BOGO";
    default:
      return "OFFER";
  }
}

function formatRelativeTime(value: string) {
  const target = new Date(value).getTime();
  const diffMs = target - Date.now();
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMs) < hourMs) {
    return rtf.format(Math.round(diffMs / minuteMs), "minute");
  }

  if (Math.abs(diffMs) < dayMs) {
    return rtf.format(Math.round(diffMs / hourMs), "hour");
  }

  return rtf.format(Math.round(diffMs / dayMs), "day");
}

function formatMetaLine(result: RedeemResult) {
  const identifier = result.phone_last_four
    ? `PHONE ****${result.phone_last_four}`
    : `CODE ${result.claim_code}`;

  return `${identifier} · ${formatRelativeTime(result.claimed_at)}`;
}

function normalizeErrorMessage(error?: string) {
  switch (error) {
    case "claim_already_redeemed":
      return "ALREADY REDEEMED";
    case "offer_expired":
      return "OFFER EXPIRED";
    case "offer_sold_out":
      return "SOLD OUT";
    case "wrong_merchant":
      return "WRONG STORE";
    default:
      return error ?? "REDEEM FAILED";
  }
}

function sanitizeQuery(value: string) {
  return value.replace(/\s+/g, "").toUpperCase();
}

export default function RedeemTerminalPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const successTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RedeemResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const showIdleState = trimmedQuery.length === 0;

  const resultCountLabel = useMemo(() => {
    if (showIdleState) {
      return "READY";
    }

    if (isSearching) {
      return "SEARCHING";
    }

    return `${results.length} MATCH${results.length === 1 ? "" : "ES"}`;
  }, [isSearching, results.length, showIdleState]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current);
      }

      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!trimmedQuery) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      setHasSearched(true);

      try {
        const response = await fetch(
          `/api/merchant/redeem/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as RedeemResult[] | { error?: string };

        if (!response.ok) {
          throw new Error(
            !Array.isArray(payload) && payload.error ? payload.error : "SEARCH FAILED",
          );
        }

        setResults(Array.isArray(payload) ? payload : []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setResults([]);
        setSearchError(error instanceof Error ? error.message : "SEARCH FAILED");
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [trimmedQuery]);

  function showToast(message: string) {
    setToastMessage(message);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 3000);
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(sanitizeQuery(event.target.value));
  }

  async function handleRedeem(claimId: string) {
    setActiveClaimId(claimId);

    try {
      const response = await fetch("/api/merchant/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claim_id: claimId }),
      });

      const payload = (await response.json()) as RedeemResponse | { error?: string };

      if (!response.ok || !("ok" in payload) || payload.ok !== true) {
        const message =
          "error" in payload ? normalizeErrorMessage(payload.error) : "REDEEM FAILED";
        showToast(message);
        return;
      }

      const body = payload;
      setResults((current) => current.filter((item) => item.claim_id !== claimId));
      setSuccessState({
        claimId,
        offerRemaining:
          typeof body.offer_remaining === "number" ? body.offer_remaining : null,
        is_bonus_position: body.is_bonus_position === true,
        bonus_reward_text: body.bonus_reward_text ?? null,
        bonus_reward_description: body.bonus_reward_description ?? null,
        position_number: body.position_number,
      });

      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = window.setTimeout(() => {
        setSuccessState(null);
        successTimeoutRef.current = null;
        inputRef.current?.focus();
      }, 1500);
    } catch {
      showToast("NETWORK ERROR. TRY AGAIN.");
    } finally {
      setActiveClaimId(null);
    }
  }

  const isBonusFlash = successState?.is_bonus_position === true;
  const successFooter =
    typeof successState?.position_number === "number"
      ? `POSITION #${successState.position_number} — HAND PRIZE TO CUSTOMER`
      : "POSITION #-- — HAND PRIZE TO CUSTOMER";

  return (
    <div className="rt-terminal">
      {toastMessage ? (
        <div className="rt-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}

      {successState ? (
        <div
          className={`rt-success-flash${
            isBonusFlash ? " rt-success-flash--bonus" : ""
          }`}
          role="status"
          aria-live="assertive"
        >
          <div className="rt-success-mark">{isBonusFlash ? "🎁" : "✓"}</div>
          <div className="rt-success-title">
            {isBonusFlash ? "🎁 BONUS DROP!" : "REDEEMED ✓"}
          </div>
          {isBonusFlash ? (
            <>
              <div className="rt-success-bonus">
                {successState.bonus_reward_text ?? "BONUS PRIZE"}
              </div>
              {successState.bonus_reward_description ? (
                <div className="rt-success-description">
                  {successState.bonus_reward_description}
                </div>
              ) : null}
              <div className="rt-success-footer">{successFooter}</div>
            </>
          ) : (
            <>
              <div className="rt-success-credit">+15 CREDIT TO CUSTOMER</div>
              <div className="rt-success-remaining">
                {successState.offerRemaining ?? "--"} REMAINING
              </div>
            </>
          )}
        </div>
      ) : null}

      <section className="rt-search-panel">
        <div className="rt-search-panel-header">
          <span className="rt-eyebrow">REDEEM TERMINAL</span>
          <span className="rt-search-status">{hasSearched ? "LIVE SEARCH" : "READY"}</span>
        </div>

        <label className="rt-search-label" htmlFor="redeem-terminal-query">
          INPUT PHONE LAST 4 OR CODE
        </label>

        <div className="rt-search-input-row">
          <input
            ref={inputRef}
            id="redeem-terminal-query"
            className="rt-search-input"
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="INPUT PHONE LAST 4 OR CODE"
            autoComplete="off"
            autoCapitalize="characters"
            inputMode="numeric"
            enterKeyHint="search"
            spellCheck={false}
            aria-describedby="redeem-terminal-helper"
          />
          <div className="rt-search-inline-status" aria-live="polite">
            {resultCountLabel}
            {isSearching ? <span className="rt-loading-dots" aria-hidden="true" /> : null}
          </div>
        </div>

        {searchError ? (
          <p id="redeem-terminal-helper" className="rt-search-error">
            {searchError}
          </p>
        ) : (
          <p id="redeem-terminal-helper" className="rt-search-helper">
            INPUT DIGITS OR CLAIM CODE. RESULTS UPDATE AUTOMATICALLY.
          </p>
        )}
      </section>

      {showIdleState ? (
        <section className="rt-empty-state">
          <h1 className="rt-empty-title">TAP NUMPAD TO SEARCH</h1>
        </section>
      ) : null}

      {!showIdleState && !isSearching && hasSearched && !searchError && results.length === 0 ? (
        <section className="rt-empty-state rt-empty-state--results">
          <p className="rt-empty-copy">
            NO MATCH. HAVE THEM SCAN THE CREATOR LINK AGAIN.
          </p>
        </section>
      ) : null}

      {!showIdleState && results.length > 0 ? (
        <section className="rt-results" aria-live="polite">
          {results.map((result) => (
            <article className="rt-result-card" key={result.claim_id}>
              <div className="rt-result-copy">
                <p className="rt-result-offer">{formatOffer(result.hero_offer)}</p>
                <p className="rt-result-source">
                  FROM @{result.creator.handle ?? result.creator.name ?? "UNKNOWN"} ·{" "}
                  {result.campaign.title ?? "UNTITLED CAMPAIGN"}
                </p>
                <p className="rt-result-meta">{formatMetaLine(result)}</p>
              </div>

              <button
                type="button"
                className="rt-redeem-button"
                onClick={() => handleRedeem(result.claim_id)}
                disabled={activeClaimId === result.claim_id}
              >
                {activeClaimId === result.claim_id ? "REDEEMING" : "REDEEM"}
              </button>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}

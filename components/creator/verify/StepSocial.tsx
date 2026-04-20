"use client";

import { useState } from "react";
import type { KycSocialAccount } from "@/lib/verify/mock-kyc";
import { mockOAuthConnect } from "@/lib/verify/mock-kyc";

interface Props {
  socials: KycSocialAccount[];
  onChange: (socials: KycSocialAccount[]) => void;
}

const PRIMARY_PLATFORMS: KycSocialAccount["platform"][] = [
  "instagram",
  "tiktok",
  "xiaohongshu",
];
const OPTIONAL_PLATFORMS: KycSocialAccount["platform"][] = [
  "youtube",
  "twitter",
];

const PLATFORM_LABELS: Record<KycSocialAccount["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  xiaohongshu: "Little Red Book",
  youtube: "YouTube",
  twitter: "X / Twitter",
};

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function PlatformCard({
  account,
  onConnect,
  optional,
}: {
  account: KycSocialAccount;
  onConnect: (updated: KycSocialAccount) => void;
  optional?: boolean;
}) {
  const [authorizing, setAuthorizing] = useState(false);

  function handleConnect() {
    setAuthorizing(true);
    // Simulate OAuth round-trip — 2s delay
    setTimeout(() => {
      const connected = mockOAuthConnect(account.platform);
      onConnect(connected);
      setAuthorizing(false);
    }, 2000);
  }

  return (
    <div
      className={`kv-social-card${account.connected ? " kv-social-card--connected" : ""}`}
    >
      <div className="kv-social-card__header">
        <div className="kv-social-card__name">
          <span className="kv-label">{PLATFORM_LABELS[account.platform]}</span>
          {optional && (
            <span className="kv-badge kv-badge--muted">Optional</span>
          )}
        </div>
        {account.connected ? (
          <div className="kv-social-card__status">
            <span className="kv-connected-dot" aria-label="Connected" />
            <span className="kv-social-handle">{account.handle}</span>
            <span className="kv-social-followers">
              {formatFollowers(account.followers)} followers
            </span>
          </div>
        ) : (
          <button
            type="button"
            className={`kv-oauth-btn${authorizing ? " kv-oauth-btn--loading" : ""}`}
            onClick={handleConnect}
            disabled={authorizing}
            aria-busy={authorizing}
          >
            {authorizing ? (
              <>
                <span className="kv-dots">
                  <span className="kv-dot" />
                  <span className="kv-dot" />
                  <span className="kv-dot" />
                </span>
                <span>Authorizing...</span>
              </>
            ) : (
              `Connect ${PLATFORM_LABELS[account.platform]}`
            )}
          </button>
        )}
      </div>

      {account.connected && account.recentPosts.length > 0 && (
        <div className="kv-social-posts" aria-label="Recent posts">
          {account.recentPosts.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Post ${i + 1}`}
              className="kv-post-thumb"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StepSocial({ socials, onChange }: Props) {
  function updateAccount(updated: KycSocialAccount) {
    onChange(
      socials.map((s) => (s.platform === updated.platform ? updated : s)),
    );
  }

  const primaryAccounts = socials.filter((s) =>
    PRIMARY_PLATFORMS.includes(s.platform),
  );
  const optionalAccounts = socials.filter((s) =>
    OPTIONAL_PLATFORMS.includes(s.platform),
  );
  const anyConnected = socials.some((s) => s.connected);

  return (
    <div className="kv-step-body">
      <h2 className="kv-step-heading">Social Accounts</h2>
      <p className="kv-step-sub">
        Connect at least one account so we can verify your audience.
      </p>

      <div className="kv-social-list">
        {primaryAccounts.map((account) => (
          <PlatformCard
            key={account.platform}
            account={account}
            onConnect={updateAccount}
          />
        ))}
      </div>

      <div className="kv-optional-divider">
        <span>Optional platforms</span>
      </div>

      <div className="kv-social-list">
        {optionalAccounts.map((account) => (
          <PlatformCard
            key={account.platform}
            account={account}
            onConnect={updateAccount}
            optional
          />
        ))}
      </div>

      {!anyConnected && (
        <p className="kv-warn-inline" role="alert">
          Connect at least one platform to continue.
        </p>
      )}
    </div>
  );
}

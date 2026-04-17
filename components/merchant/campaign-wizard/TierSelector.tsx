"use client";

export type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

const TIERS: {
  id: CreatorTier;
  label: string;
  followers: string;
  score: string;
  color: string;
}[] = [
  {
    id: "seed",
    label: "Seed",
    followers: "< 1K",
    score: "0–199",
    color: "#669bbc",
  },
  {
    id: "explorer",
    label: "Explorer",
    followers: "1K–5K",
    score: "200–399",
    color: "#003049",
  },
  {
    id: "operator",
    label: "Operator",
    followers: "5K–20K",
    score: "400–599",
    color: "#003049",
  },
  {
    id: "proven",
    label: "Proven",
    followers: "20K–50K",
    score: "600–749",
    color: "#c1121f",
  },
  {
    id: "closer",
    label: "Closer",
    followers: "50K–200K",
    score: "750–899",
    color: "#c1121f",
  },
  {
    id: "partner",
    label: "Partner",
    followers: "200K+",
    score: "900–1000",
    color: "#c9a96e",
  },
];

interface TierSelectorProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export function TierSelector({ value, onChange, error }: TierSelectorProps) {
  return (
    <div>
      <div className="cw-tier-grid">
        {TIERS.map((tier) => {
          const active = value === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              className={[
                "cw-tier-card",
                active ? "cw-tier-card--active" : "",
                tier.id === "partner" ? "cw-tier-card--partner" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onChange(tier.id)}
              aria-pressed={active}
              style={
                active
                  ? {
                      borderColor: tier.color,
                      background:
                        tier.id === "partner"
                          ? "rgba(201,169,110,0.08)"
                          : "rgba(0,48,73,0.04)",
                    }
                  : undefined
              }
            >
              <span
                className="cw-tier-dot"
                style={{ background: tier.color }}
              />
              <span className="cw-tier-name">{tier.label}</span>
              <span className="cw-tier-meta">{tier.followers} followers</span>
              <span className="cw-tier-score">Score {tier.score}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <span className="cw-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

"use client";
import "./pending-brief.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PendingBriefScreenProps = {
  campaignTitle: string;
  merchantName: string;
  businessAddress: string;
  category: string;
  requirements: string[];
  payout: number;
  deadline: string;
  appliedAt: string; // ISO date string
  estimatedResponseHours: number; // e.g. 12
};

// ---------------------------------------------------------------------------
// Content data
// ---------------------------------------------------------------------------

const CATEGORY_TIPS: Record<string, string[]> = {
  Food: [
    "Arrive 30 min before peak hours for best lighting and less crowd",
    'Order the featured item PLUS one visual "hero" dish for b-roll',
    "Ask what the chefs are proudest of — authentic reactions > scripted",
  ],
  Coffee: [
    "Morning shoots (9–11am) get the best natural light through windows",
    "Capture the pour AND the first sip — both are scroll-stoppers",
    "Get the barista name — tagged creators get 2x engagement on coffee content",
  ],
  Beauty: [
    "Film the consultation + transformation process, not just the result",
    "Natural light near windows is best for skin/hair treatments",
    "Ask for permission to film staff — most are happy to be featured",
  ],
  Retail: [
    "Show scale: product in hand, being tried, in the space",
    "Focus on the STORY of the product — why did this brand make it?",
    "Price and availability details drive purchase intent — mention them",
  ],
  default: [
    "Scout the space first — find the 2–3 most photogenic spots",
    "Mix wide shots (establish the vibe) with close-ups (show quality)",
    "Authentic reactions outperform scripted content by 40%",
  ],
};

type ShootingTimes = { morning: number; afternoon: number; evening: number };

function getShootingTimes(category: string): ShootingTimes {
  if (category === "Food" || category === "Coffee") {
    return { morning: 90, afternoon: 70, evening: 60 };
  }
  return { morning: 80, afternoon: 90, evening: 50 };
}

function getTips(category: string): string[] {
  return CATEGORY_TIPS[category] ?? CATEGORY_TIPS["default"];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RedSquareBullet() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        background: "var(--primary)",
        flexShrink: 0,
        marginTop: 6,
        borderRadius: 0,
      }}
    />
  );
}

function ShootingTimeRow({
  label,
  time,
  pct,
}: {
  label: string;
  time: string;
  pct: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontFamily: "CS Genio Mono, monospace",
          fontSize: 11,
          color: "rgba(0,48,73,0.6)",
          width: 80,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div className="pb-bar-track">
        <div className="pb-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span
        style={{
          fontFamily: "CS Genio Mono, monospace",
          fontSize: 11,
          color: "rgba(0,48,73,0.5)",
          width: 60,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {time}
      </span>
    </div>
  );
}

// Animated matching indicator: three pulsing dots
function MatchingIndicator() {
  return (
    <>
      <style>{`
        @keyframes pb-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        .pb-dot {
          width: 7px;
          height: 7px;
          background: var(--primary);
          border-radius: var(--r-xl);
          display: inline-block;
          animation: pb-dot-bounce 1.4s ease-in-out infinite;
        }
        .pb-dot:nth-child(2) { animation-delay: 0.2s; }
        .pb-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
        aria-label="Matching in progress"
      >
        <span className="pb-dot" />
        <span className="pb-dot" />
        <span className="pb-dot" />
      </div>
    </>
  );
}

// Estimated wait display
function EstimatedWait({
  hoursAgo,
  estimatedResponseHours,
}: {
  hoursAgo: number;
  estimatedResponseHours: number;
}) {
  const remainingHours = Math.max(0, estimatedResponseHours - hoursAgo);
  const pct = Math.min(100, (hoursAgo / estimatedResponseHours) * 100);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 10,
      }}
    >
      <span
        style={{
          fontFamily: "CS Genio Mono, monospace",
          fontSize: 11,
          color: "rgba(0,48,73,0.5)",
          flexShrink: 0,
        }}
      >
        {hoursAgo === 0 ? "Just now" : `${hoursAgo}h ago`}
      </span>
      {/* Animated wait track */}
      <div
        style={{
          flex: 1,
          height: 2,
          background: "rgba(0,48,73,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="pb-bar-fill pb-wait-fill"
          style={{ height: "100%", width: `${pct}%` }}
        />
      </div>
      <span
        style={{
          fontFamily: "CS Genio Mono, monospace",
          fontSize: 11,
          color: remainingHours === 0 ? "var(--primary)" : "rgba(0,48,73,0.5)",
          flexShrink: 0,
          fontWeight: remainingHours === 0 ? 700 : 400,
        }}
      >
        {remainingHours === 0 ? "Soon!" : `~${remainingHours}h left`}
      </span>
    </div>
  );
}

// Profile tip card
function ProfileTipCard() {
  return (
    <div
      style={{
        border: "1.5px solid rgba(193,18,31,0.2)",
        background: "rgba(193,18,31,0.03)",
        padding: "14px 16px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 5,
          background: "var(--primary)",
          alignSelf: "stretch",
          flexShrink: 0,
          borderRadius: 0,
        }}
      />
      <div>
        <p
          style={{
            fontFamily: "CS Genio Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--primary)",
            margin: "0 0 5px",
          }}
        >
          While you wait
        </p>
        <p
          style={{
            fontFamily: "CS Genio Mono, monospace",
            fontSize: 12,
            color: "rgba(0,48,73,0.7)",
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          Complete your profile to improve matching accuracy. Creators with full
          profiles get approved{" "}
          <strong style={{ color: "var(--dark)" }}>2.4× faster</strong>.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PendingBriefScreen({
  campaignTitle,
  merchantName,
  businessAddress,
  category,
  requirements,
  payout,
  deadline,
  appliedAt,
  estimatedResponseHours,
}: PendingBriefScreenProps) {
  const hoursAgo = Math.floor(
    (Date.now() - new Date(appliedAt).getTime()) / (1000 * 60 * 60),
  );

  const tips = getTips(category);
  const times = getShootingTimes(category);
  const mapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(businessAddress)}`;

  return (
    <div className="pb-container" style={{ background: "var(--surface)" }}>
      {/* ── MATCHING HERO ────────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--dark)",
          padding: "28px 24px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 12,
        }}
      >
        {/* Animated indicator */}
        <MatchingIndicator />

        {/* Heading */}
        <h2
          style={{
            fontFamily: "Darky, serif",
            fontWeight: 800,
            fontSize: "clamp(22px, 5vw, 30px)",
            letterSpacing: "-0.03em",
            color: "var(--surface)",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Matching you with the perfect campaign...
        </h2>

        <p
          style={{
            fontFamily: "CS Genio Mono, monospace",
            fontSize: 12,
            color: "rgba(245,242,236,0.6)",
            margin: 0,
            letterSpacing: "0.02em",
            lineHeight: 1.5,
          }}
        >
          Our engine is reviewing your profile against{" "}
          <strong style={{ color: "rgba(245,242,236,0.85)" }}>
            {merchantName}
          </strong>
          &apos;s requirements.
        </p>

        {/* Estimated wait bar */}
        <div style={{ width: "100%", maxWidth: 340 }}>
          <p
            style={{
              fontFamily: "CS Genio Mono, monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(245,242,236,0.4)",
              margin: "0 0 6px",
              textAlign: "left",
            }}
          >
            Est. response: {estimatedResponseHours}h
          </p>
          <EstimatedWait
            hoursAgo={hoursAgo}
            estimatedResponseHours={estimatedResponseHours}
          />
        </div>
      </div>

      {/* ── STATUS PILL ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: "rgba(0,48,73,0.04)",
          borderBottom: "1px solid rgba(0,48,73,0.08)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            background: "var(--tertiary)",
            borderRadius: 0,
            flexShrink: 0,
          }}
        />
        <p
          style={{
            fontFamily: "CS Genio Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--tertiary)",
            margin: 0,
          }}
        >
          Awaiting Approval
        </p>
        <span
          style={{
            fontFamily: "CS Genio Mono, monospace",
            fontSize: 11,
            color: "rgba(0,48,73,0.4)",
            marginLeft: "auto",
          }}
        >
          Applied {hoursAgo === 0 ? "just now" : `${hoursAgo}h ago`}
        </span>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: "20px" }}>
        {/* Profile tip */}
        <div style={{ marginBottom: 24 }}>
          <ProfileTipCard />
        </div>

        {/* Info cards grid */}
        <div className="pb-tips-grid" style={{ marginBottom: 24 }}>
          {/* Location card */}
          <div
            style={{
              border: "1px solid rgba(0,48,73,0.08)",
              padding: 16,
              background: "var(--surface-elevated)",
            }}
          >
            <p
              style={{
                fontFamily: "CS Genio Mono, monospace",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(0,48,73,0.4)",
                margin: "0 0 8px",
              }}
            >
              📍 The Location
            </p>
            <p
              style={{
                fontFamily: "CS Genio Mono, monospace",
                fontSize: 13,
                color: "var(--dark)",
                margin: "0 0 4px",
                fontWeight: 700,
              }}
            >
              {merchantName}
            </p>
            <p
              style={{
                fontFamily: "CS Genio Mono, monospace",
                fontSize: 12,
                color: "rgba(0,48,73,0.6)",
                margin: "0 0 12px",
                lineHeight: 1.5,
              }}
            >
              {businessAddress}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "CS Genio Mono, monospace",
                fontSize: 12,
                color: "var(--primary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 700,
              }}
            >
              Open Maps →
            </a>
          </div>

          {/* Brief card */}
          <div
            style={{
              border: "1px solid rgba(0,48,73,0.08)",
              padding: 16,
              background: "var(--surface-elevated)",
            }}
          >
            <p
              style={{
                fontFamily: "CS Genio Mono, monospace",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(0,48,73,0.4)",
                margin: "0 0 8px",
              }}
            >
              Your Brief
            </p>
            <p
              style={{
                fontFamily: "Darky, serif",
                fontSize: 15,
                color: "var(--dark)",
                margin: "0 0 10px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {campaignTitle}
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {requirements.map((req, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: "CS Genio Mono, monospace",
                    fontSize: 12,
                    color: "rgba(0,48,73,0.7)",
                    marginBottom: 6,
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <RedSquareBullet />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content prep tips */}
        <p
          style={{
            fontFamily: "CS Genio Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(0,48,73,0.45)",
            margin: "0 0 4px",
          }}
        >
          Content Prep Tips{" "}
          <span
            style={{
              color: "rgba(0,48,73,0.28)",
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            (based on {category || "your category"})
          </span>
        </p>

        <div style={{ marginBottom: 24 }}>
          {tips.map((tip, i) => (
            <div key={i} className="pb-tip-item">
              <RedSquareBullet />
              <span
                style={{
                  fontFamily: "CS Genio Mono, monospace",
                  fontSize: 13,
                  color: "rgba(0,48,73,0.75)",
                  lineHeight: 1.55,
                }}
              >
                {tip}
              </span>
            </div>
          ))}
        </div>

        {/* Best shooting times */}
        <p
          style={{
            fontFamily: "CS Genio Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(0,48,73,0.45)",
            margin: "0 0 14px",
          }}
        >
          Best Shooting Times
        </p>

        <div style={{ marginBottom: 24 }}>
          <ShootingTimeRow label="Morning" time="10–12pm" pct={times.morning} />
          <ShootingTimeRow
            label="Afternoon"
            time="2–4pm"
            pct={times.afternoon}
          />
          <ShootingTimeRow label="Evening" time="6–8pm" pct={times.evening} />
        </div>

        {/* Payout reminder */}
        <div
          style={{
            background: "rgba(102,155,188,0.08)",
            borderLeft: "3px solid var(--tertiary)",
            padding: 16,
          }}
        >
          <p
            style={{
              fontFamily: "CS Genio Mono, monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--tertiary)",
              margin: "0 0 8px",
            }}
          >
            Payout Reminder
          </p>
          <p
            style={{
              fontFamily: "CS Genio Mono, monospace",
              fontSize: 13,
              color: "var(--dark)",
              margin: "0 0 8px",
              fontWeight: 700,
            }}
          >
            Base: ${payout.toFixed(2)} · Commission: 3% per walk-in
          </p>
          <p
            style={{
              fontFamily: "CS Genio Mono, monospace",
              fontSize: 12,
              color: "rgba(0,48,73,0.6)",
              margin: 0,
              lineHeight: 1.55,
              fontStyle: "italic",
            }}
          >
            &ldquo;At Operator tier you earn on every customer your content
            brings in — approval unlocks your link.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

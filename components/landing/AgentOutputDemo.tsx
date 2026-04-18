/* ============================================================
   AgentOutputDemo — v5.0 Hero right column
   Simulates one agent run: merchant goal input → 60s match
   Pure CSS stagger animation, no state.
   ============================================================ */

const MATCHES = [
  {
    handle: "@maya.eats.nyc",
    tier: "Steel",
    tierColor: "#4a5568",
    score: 94,
    est: "6 customers",
  },
  {
    handle: "@brooklyn_bites",
    tier: "Gold",
    tierColor: "#c9a96e",
    score: 91,
    est: "5 customers",
  },
  {
    handle: "@williamsburg.e",
    tier: "Steel",
    tierColor: "#4a5568",
    score: 89,
    est: "4 customers",
  },
  {
    handle: "@coffee.crawl",
    tier: "Bronze",
    tierColor: "#8c6239",
    score: 86,
    est: "4 customers",
  },
  {
    handle: "@sip.and.scroll",
    tier: "Bronze",
    tierColor: "#8c6239",
    score: 83,
    est: "3 customers",
  },
];

export default function AgentOutputDemo() {
  return (
    <div className="agent-demo" aria-hidden="true">
      <div className="agent-demo-bar">
        <span className="agent-demo-dot" />
        <span className="agent-demo-title">push-agent</span>
        <span className="agent-demo-meta">claude-sonnet-4-6</span>
      </div>

      <div className="agent-demo-body">
        <div className="agent-demo-row agent-demo-row--prompt">
          <span className="agent-demo-caret">&gt;</span>
          <span className="agent-demo-text">
            20 customers · coffee · Williamsburg · $400 / 1wk
          </span>
        </div>

        <div className="agent-demo-row agent-demo-row--status">
          <span className="agent-demo-bar-track">
            <span className="agent-demo-bar-fill" />
          </span>
          <span className="agent-demo-status-text">
            matching creators&hellip;
          </span>
        </div>

        <div className="agent-demo-output">
          <div className="agent-demo-out-label">Top 5 matches · 47s</div>
          <ul className="agent-demo-list">
            {MATCHES.map((m, i) => (
              <li
                key={m.handle}
                className="agent-demo-item"
                style={{ animationDelay: `${1.6 + i * 0.35}s` }}
              >
                <span
                  className="agent-demo-tier-dot"
                  style={{ background: m.tierColor }}
                  aria-hidden="true"
                />
                <span className="agent-demo-handle">{m.handle}</span>
                <span className="agent-demo-tier">{m.tier}</span>
                <span className="agent-demo-score">{m.score}</span>
                <span className="agent-demo-est">{m.est}</span>
              </li>
            ))}
          </ul>
          <div className="agent-demo-footer">
            <span className="agent-demo-footer-label">Est. deliverable</span>
            <span className="agent-demo-footer-val">
              22 verified · 91% conf
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Global loading fallback — rendered during server-side render kickoff.
 * Editorial, minimal — echoes Design.md Darky display + CS Genio Mono labels.
 */
export default function RootLoading() {
  return (
    <div className="ld-wrap" role="status" aria-live="polite" aria-busy="true">
      <div className="ld-inner">
        <div className="ld-eyebrow">
          <span className="ld-dot" aria-hidden="true" />
          <span>Warming up ConversionOracle&trade;</span>
        </div>

        <div className="ld-title">
          <span className="ld-word ld-word-1">Push</span>
          <span className="ld-word ld-word-2">·</span>
          <span className="ld-word ld-word-3">loading</span>
        </div>

        <div className="ld-bar" aria-hidden="true">
          <span className="ld-bar-fill" />
        </div>

        <div className="ld-meta">
          Vertical AI for Local Commerce · Williamsburg Coffee+ beachhead
        </div>
      </div>

      <span className="ld-sr">Loading — please wait.</span>

      <style>{`
        .ld-wrap {
          min-height: calc(100svh - 56px);
          background: var(--surface, #f5f2ec);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .ld-inner {
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ld-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'CS Genio Mono', 'SF Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--primary, #c1121f);
        }
        .ld-dot {
          width: 6px;
          height: 6px;
          background: var(--primary, #c1121f);
          border-radius: 0;
          display: inline-block;
          animation: ld-pulse 1.4s ease-in-out infinite;
        }
        @keyframes ld-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        .ld-title {
          font-family: 'Darky', sans-serif;
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 0.95;
          color: var(--dark, #003049);
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .ld-word {
          animation: ld-word-in 680ms cubic-bezier(0.22,1,0.36,1) both;
        }
        .ld-word-1 { animation-delay: 0ms; }
        .ld-word-2 { animation-delay: 140ms; color: var(--primary, #c1121f); }
        .ld-word-3 { animation-delay: 240ms; font-weight: 200; color: rgba(0,48,73,0.45); }
        @keyframes ld-word-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ld-bar {
          width: 100%;
          height: 2px;
          background: rgba(0, 48, 73, 0.08);
          overflow: hidden;
          position: relative;
        }
        .ld-bar-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 28%;
          background: var(--champagne, #c9a96e);
          animation: ld-bar-move 1.4s ease-in-out infinite;
        }
        @keyframes ld-bar-move {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(150%); }
          100% { transform: translateX(380%); }
        }
        .ld-meta {
          font-family: 'CS Genio Mono', 'SF Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(0, 48, 73, 0.45);
        }
        .ld-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .ld-dot, .ld-word, .ld-bar-fill { animation: none; }
        }
      `}</style>
    </div>
  );
}

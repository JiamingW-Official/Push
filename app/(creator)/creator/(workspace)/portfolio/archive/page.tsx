export default function PortfolioArchivePage() {
  return (
    <div style={{ padding: "32px" }}>
      <h1
        style={{
          fontFamily: "Darky, sans-serif",
          fontSize: "clamp(32px, 4vw, 48px)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          color: "#003049",
          margin: 0,
        }}
      >
        Archive
      </h1>
      <p
        style={{
          fontFamily: "'CS Genio Mono', monospace",
          fontSize: "14px",
          color: "#4a5568",
          marginTop: "12px",
        }}
      >
        Archive is empty. Your first completed campaign lands here.
      </p>
    </div>
  );
}

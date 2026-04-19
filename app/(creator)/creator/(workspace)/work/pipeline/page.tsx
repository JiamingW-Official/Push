export default function WorkPipelinePage() {
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
        Pipeline
      </h1>
      <p
        style={{
          fontFamily: "'CS Genio Mono', monospace",
          fontSize: "14px",
          color: "#4a5568",
          marginTop: "12px",
        }}
      >
        Pipeline is empty. Accept an invite or explore Discover to start.
      </p>
    </div>
  );
}

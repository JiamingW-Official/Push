export default function InboxPage() {
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
        Inbox
      </h1>
      <p
        style={{
          fontFamily: "'CS Genio Mono', monospace",
          fontSize: "14px",
          color: "#4a5568",
          marginTop: "12px",
        }}
      >
        Clear inbox. Agent&apos;s still matching — new invite typically lands
        within 4h.
      </p>
    </div>
  );
}

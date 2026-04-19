export default function InboxLoading() {
  return (
    <div style={{ padding: "32px" }}>
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          style={{
            height: "64px",
            marginBottom: "1px",
            background:
              "linear-gradient(90deg, #f5f2ec 25%, #fafaf8 50%, #f5f2ec 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s linear infinite",
          }}
        />
      ))}
    </div>
  );
}

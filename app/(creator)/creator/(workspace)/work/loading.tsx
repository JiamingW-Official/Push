export default function WorkLoading() {
  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          height: "56px",
          width: "200px",
          marginBottom: "24px",
          background: "#f5f2ec",
        }}
      />
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{ height: "72px", marginBottom: "1px", background: "#f5f2ec" }}
        />
      ))}
    </div>
  );
}

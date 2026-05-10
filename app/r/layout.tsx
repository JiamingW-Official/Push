// Minimal layout for fan-facing referral pages (/r/[token]).
// These routes must NOT inherit SmoothScroll (Lenis sets overflow:hidden on
// <html> which can clip content on mobile Safari).
// The root app/layout.tsx still applies — this adds a wrapper that
// sets the page background before React hydrates so the dark
// background shows immediately with zero flash.

export default function ReferralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-referral-route="true"
      style={{ background: "#1a1916", minHeight: "100vh" }}
    >
      {children}
    </div>
  );
}

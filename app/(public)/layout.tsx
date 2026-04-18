// Public route group — no shared chrome (no header/footer).
// Individual pages are fully self-contained.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

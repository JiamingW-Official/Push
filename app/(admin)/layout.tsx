// Admin route group — standalone shell, does NOT inherit marketing/creator/merchant layouts
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

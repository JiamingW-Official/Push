import ScanPageClient from "./ScanPageClient";

export function generateStaticParams() {
  return [{ code: "demo-blank-street-001" }];
}

export default function Page() {
  return <ScanPageClient />;
}

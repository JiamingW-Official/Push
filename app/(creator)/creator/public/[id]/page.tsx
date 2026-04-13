import CreatorPublicPage from "./CreatorPublicPageClient";

export function generateStaticParams() {
  return [{ id: "demo-creator-001" }];
}

export default function Page() {
  return <CreatorPublicPage />;
}

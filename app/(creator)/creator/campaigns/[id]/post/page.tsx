import PostWorkspaceClient from "./PostWorkspaceClient";

export function generateStaticParams() {
  return [
    "camp-001",
    "camp-002",
    "camp-003",
    "camp-004",
    "camp-005",
    "camp-006",
    "camp-007",
    "camp-008",
    "demo-campaign-001",
    "demo-campaign-002",
    "demo-campaign-003",
  ].map((id) => ({ id }));
}

export default function PostWorkspacePage() {
  return <PostWorkspaceClient />;
}

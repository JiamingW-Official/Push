// Push — Creator Dashboard Layout
// Re-applies the full workspace shell (TopNav + SideNav + ContextPanel + MobileNav)
// to /creator/dashboard, which lives outside the (workspace) route group.
// This is intentional: the dashboard page has its own CSS and data model,
// but should render within the same navigation chrome as all workspace pages.
export { default } from "@/app/(creator)/creator/(workspace)/layout";

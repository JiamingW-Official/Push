// Push — Creator Campaign Detail layout
//
// Re-exports the (workspace)/layout — the campaign detail route lives outside
// the (workspace) route group, but the chrome is identical (Lumin glass rail
// + 10vw editorial gutter + shared cw-* card system). Same pattern as
// app/(creator)/creator/dashboard/layout.tsx.
//
// This gives the campaign detail page:
//   • the unified sidebar (TODAY / GIGS / FIND / PAY / STATS / INBOX / RANKS)
//   • the global --main-pad: 10vw editorial gutter on .dh-main
//   • the demo-mode banner

export { default } from "@/app/(creator)/creator/(workspace)/layout";

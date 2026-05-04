// Push — Creator Dashboard layout
//
// Re-exports the (workspace)/layout — the dashboard route lives outside
// the (workspace) route group historically, but the chrome is identical
// (Lumin glass rail + main column + shared cw-* card system).
//
// This is the single source of truth for the creator chrome:
//   app/(creator)/creator/(workspace)/layout.tsx

export { default } from "@/app/(creator)/creator/(workspace)/layout";

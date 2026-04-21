import { redirect } from "next/navigation";

/**
 * /data-rights — spec-mandated URL for CCPA/CPRA data-rights entry point.
 *
 * The actual interactive portal lives at /my-privacy (shorter, user-friendly
 * URL). This page exists so the spec path resolves to HTTP 308 instead of
 * 404 for any partner / press / email that references /data-rights.
 */
export default function DataRightsAliasPage() {
  redirect("/my-privacy");
}

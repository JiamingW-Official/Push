import { redirect } from "next/navigation";

// Disputes merged into Operations hub — keep redirect for saved links.
export default function MerchantDisputesPage() {
  redirect("/merchant/operations?tab=disputes");
}

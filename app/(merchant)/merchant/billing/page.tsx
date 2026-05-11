import { redirect } from "next/navigation";

// Billing merged into Finance hub — keep this redirect for any saved links.
export default function MerchantBillingPage() {
  redirect("/merchant/finance");
}

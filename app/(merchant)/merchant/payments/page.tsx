import { redirect } from "next/navigation";

// Payments merged into Finance hub — keep this redirect for any saved links.
export default function MerchantPaymentsPage() {
  redirect("/merchant/finance");
}

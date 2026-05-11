import { redirect } from "next/navigation";

// Redeem merged into Operations hub — keep redirect for saved links.
export default function MerchantRedeemPage() {
  redirect("/merchant/operations?tab=redeem");
}

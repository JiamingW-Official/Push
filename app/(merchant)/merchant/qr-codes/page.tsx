import { redirect } from "next/navigation";

// QR Codes merged into Operations hub — keep redirect for saved links.
export default function MerchantQRCodesPage() {
  redirect("/merchant/operations");
}

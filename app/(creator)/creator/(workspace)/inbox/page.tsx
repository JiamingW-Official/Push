import { redirect } from "next/navigation";
export default function InboxRoot() {
  redirect("/creator/inbox/messages");
}

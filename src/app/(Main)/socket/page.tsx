"use server";
import { cookies } from "next/headers";
import SessionInactive from "@/components/SessionInactive";
import Inbox from "@/components/InboxComponents/Inbox";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

export default async function Page() {
  const session = cookies().get("session");
  if (!session) {
    return <SessionInactive />;
  }

  const value = session.value;
  const userId = await getCurrentSessionUserId();
  return (
    <Inbox session={value} userId={userId} />
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Inbox from "@/components/InboxComponents/Inbox";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

export default async function Page({ params }: { params: { id: string } }) {
  const session = cookies().get("session");
  if (!session) {
    redirect("/login");
  }

  const value = session.value;
  const userId = await getCurrentSessionUserId();
  
  console.log("params.id:", params.id);
  const chatId = parseInt(params.id);
  console.log("parsed chatId:", chatId);

  return <Inbox session={value} userId={userId} chatId={chatId} />;
}

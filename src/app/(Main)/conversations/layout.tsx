"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import MessageList from "@/components/InboxComponents/MessageList";
import getProfilePageData from "@/lib/GET_api_calls/getProfilePageData";
import { getAllUsers } from "@/lib/GET_api_calls/getAllUsers";
import { Children } from "react";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get("session");
  if (!session) {
    redirect("/login");
  }
  const value = session.value;
  const userId = await getCurrentSessionUserId();

  // Fetch username and pass to messagelist
  const pageData = await getProfilePageData(userId);
  const username = pageData.profile.username;

  // Fetch existing users in the db
  const profiles = await getAllUsers(userId);
  console.log(profiles);

  return (
    <div style={{ display: "flex" }}>
      <MessageList
        username={username}
        currentUserId={userId}
        profiles={profiles}
      />

      {children}
    </div>
  );
}

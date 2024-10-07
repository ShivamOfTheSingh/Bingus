"use server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/objectEncryption";
import pool from "@/lib/pool";
import { getProfilePageData } from "@/lib/ApiCalls";
import ProfilePageInfo from "@/components/ProfilePageComponents/ProfilePageInfo";
import ProfilePagePostGrid from "@/components/ProfilePageComponents/ProfilePagePostGrid";

export default async function Page() {
  const session = cookies().get("session");
  if (session) {
    const sessionJson = JSON.parse(decrypt(session.value));
    const client = await pool.connect();
    const userIdResult = await client.query("SELECT user_id FROM user_auth WHERE user_auth_id = $1", [sessionJson.userAuthId]);
    const userId = userIdResult.rows[0].user_id;

    const pageData = await getProfilePageData(userId);

    return (
      <div>
        <ProfilePageInfo profile={pageData.profile} numPosts={pageData.numPosts} />
        <ProfilePagePostGrid postData={pageData.posts} />
      </div>
    );
  }
}

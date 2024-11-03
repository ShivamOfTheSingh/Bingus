"use server";

import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import getPostPageData from "@/lib/GET_api_calls/getPostPageData";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }

    const pageData = await getPostPageData(parseInt(params.id), userId);
    console.log(pageData);
    return (
        <div>

        </div>
    );
}
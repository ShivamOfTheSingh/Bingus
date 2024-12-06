"use server";

import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { redirect } from "next/navigation";
import MainFeedPost from '@/components/HomeComponents/MainFeedPost';
import '@/public/MainPage.css';
import { Post, Media } from "@/lib/db/models";
import MainFeedList from "@/components/HomeComponents/MainFeedList";
import getFeedData from "@/lib/GET_api_calls/getFeedData";
import Friends from "@/components/Friends";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }

    const pageData = await getFeedData();

    return (
        <div className="page-container">
            <div className="content-container">
                <MainFeedList postData={pageData} />
            </div>
            <div className="friends-container">
                <Friends userId={userId} />
            </div>
        </div>
    );
}

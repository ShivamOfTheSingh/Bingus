"use server";

import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { redirect } from "next/navigation";
import MainFeedPost from '@/components/HomeComponents/MainFeedPost';
import { Post, Media } from "@/lib/db/models";
import profilePic from "@/public/profile-pic-temp.jpg";
import mediaTest from "@/public/logo.jpg";



export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }
    interface MainPagePostGProps {
        postData: { post: Post, media: Media[] }[]; 
        className?: string;
    }
    const dummyPost = {
        post: {
          caption: "This is a test post caption.",
          datePosted: new Date("2024-11-24T14:00:00Z"), 
        },
        userProfileImage: profilePic, // Replace with actual image URL
        userName: "John Doe",
        userUsername: "johndoe123",
        media: {
          mediaUrl: mediaTest, // Replace with actual image or media URL
        },
        className: "custom-classname", // Optional className for additional styling
      };

    return (
        <div className="flex justify-center">
            
            <div className="container ">
                <h1>Your Feed</h1>
                <MainFeedPost {...dummyPost} />
            </div>
        </div>
    );
}
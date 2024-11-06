"use server";

import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { redirect } from "next/navigation";
import NewPostForm from "@/components/forms/NewPostForm";


export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div>
                <NewPostForm />
            </div>
        </div>
    );
}
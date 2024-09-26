// api/comment_reply/[id]
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        console.log(request.nextUrl)
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}
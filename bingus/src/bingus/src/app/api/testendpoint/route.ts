import handleError from "@/lib/errors";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    try {
        return new Response(JSON.stringify({ content:"Hello World" }), { status: 200 });
    }
    catch (error) {
        return handleError(error);
    }
}
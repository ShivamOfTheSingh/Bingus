import handleError from "@/lib/errors";
import { NextRequest } from "next/server";

//get aws data here
export async function GET(request: NextRequest): Promise<Response> {
    try {
        return new Response();
    }
    catch (error) {
        return handleError(error);
    }
}
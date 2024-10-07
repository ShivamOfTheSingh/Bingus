import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Middleware function that checks if a user is currently logged in.
 * 
 * @param {request} request Incoming HTTP request
 * @returns {NextResponse} Redirect back or authenticate to route
 */
export function middleware(request: Request): NextResponse {
    const isLoggedIn = Boolean(cookies().get("session"));
    const isCreatingUser = request.url.endsWith("user_profile") && request.method === "POST"; // Only CRUD operation allowed without loggin in is POST user_profile
    
    if (isLoggedIn || isCreatingUser) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/session_inactive", request.url));
}

export const config = {
    matcher: [
        "/api/crud/:path*",
        "/main/:path*"
    ]
};
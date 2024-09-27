"use client";

import ApiError from "@/lib/ApiError";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div>
            API error occured.
            {error.message}
            {error instanceof ApiError ? error.httpStatus : null}
        </div>
    );
}
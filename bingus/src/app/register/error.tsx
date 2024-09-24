"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div>
            Error occured.
            {error.stack}
        </div>
    );
}
"use client";

import ApiError from "@/lib/errors/ApiError";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="text-red-700 flex flex-col">
            <div className="text-5xl">
                {error.message}
            </div>
            <div className="text-3xl">
                {error instanceof ApiError ? error.httpStatus : null}
            </div>
            <Button variant="danger">
                <Link href="/">Go to Home Page.</Link>
            </Button>
        </div>
    );
}
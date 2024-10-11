import Link from "next/link";

export default function SessionInactive() {
    return (
        <div className="flex flex-col items-center gap-2">
            Session is inactive.
            <Link href="/">Go to home page.</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
        </div>
    );
}
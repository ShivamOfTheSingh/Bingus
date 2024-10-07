import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col gap-2">
            Session is inactive.
            <Link href="/">Go to home page.</Link>
            <Link href="/">Login</Link>
            <Link href="/">Register</Link>
        </div>
    );
}
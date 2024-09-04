"use client";
import { useFormState } from "react-dom";
import { fetchAwsData } from "@/lib/actions";

export default function Content() {
    const [state, formAction] = useFormState(fetchAwsData, { data: {} });

    return (
        <form action={formAction}>
            <div>
                {state?.data.content}
            </div>
            <button type="submit">Fetch Data</button>
        </form>
    );
}
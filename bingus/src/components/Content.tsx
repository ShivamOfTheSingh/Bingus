"use client";
import { useFormState } from "react-dom";
import { fetchAwsData } from "@/lib/actions";

export default function Content() {
    const [state, formAction] = useFormState(fetchAwsData, { data: {} });

    return (
        <form action={formAction}>
            <div>
                {JSON.stringify(state?.data)}
            </div>
            <button type="submit" style={{backgroundColor: "red"}}>Fetch Data</button>
        </form>
    );
}
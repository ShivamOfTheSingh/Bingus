"use server";

export async function fetchAwsData(prevState: any, formData: FormData) {
    const response = await fetch("http://localhost:3000/api/awsdata");
    console.log("LOLOLOLO")
    const json = await response.json();
    return {
        data: json
    }
}
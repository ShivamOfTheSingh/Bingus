export default function handleError(error: Error | unknown): Response {
    return new Response("An error occured", { status: 500 });
}
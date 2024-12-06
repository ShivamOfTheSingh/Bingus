import pool from "@/lib/db/pool";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT data, format FROM media WHERE media_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("Not Found", { status: 404 });
        }

        const data = result.rows[0].data;
        const format = result.rows[0].format;

        let contentType: string;
        switch (format) {
            case 'jpeg':
                contentType = 'image/jpeg';
                break;
            case 'png':
                contentType = 'image/png';
                break;
            case 'gif':
                contentType = 'image/gif';
                break;
            case 'mp4':
                contentType = 'video/mp4';
                break;
            default:
                return new Response("Unsupported format", { status: 415 });
        }

        return new Response(data, {
            headers: {
                "Content-Type": contentType
            },
            status: 200
        });
    }
    catch (error) {
        return new Response("Internal Server Error", { status: 500 })
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
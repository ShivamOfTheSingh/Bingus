import pool from "@/lib/db/pool";
import { UserProfile } from "@/lib/db/models";

export async function GET(request: Request,  { params }: { params: { id: string } }): Promise<Response> {
   let client;
   try {
    client = await pool.connect();
    const result = await client.query("SELECT up.* FROM followings AS f INNER JOIN user_profile AS up ON f.user_id = up.user_id WHERE f.following_id = $1", [params.id]);

    const users: UserProfile[] = result.rows.map((row: any) => {
        const user: UserProfile = {
            userId: row.user_id,
            username: row.user_name,
            email: row.email,
            firstName: row.first_name,
            lastName: row.last_name,
            gender: row.gender,
            birthDate: row.birth_date,
            about: row.about,
            profilePicture: row.profile_pic ? row.pic_mime_type_prefix + Buffer.from(row.profile_pic, 'base64').toString('base64') : ""
        }
        return user;
    });

    return new Response(JSON.stringify(users), { status: 200 })
   }
   catch (error: any) {
    return new Response("Internal server error.", { status: 500 })
   }
   finally {
    if (client) {
        client.release();
    }
   } 
}
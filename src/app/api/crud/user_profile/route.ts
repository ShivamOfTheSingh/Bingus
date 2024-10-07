import { UserProfile } from "@/lib/models";
import pool from "../../../../lib/pool";

/**
 * GET endpoint for table user_profile (Fetch all profiles)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of UserProfile objects or an error code
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM user_profile");
        const userProfiles: UserProfile[] = result.rows.map((row: any) => (
            {
                userId: row.user_id,
                username: row.user_name,
                email: row.email,
                firstName: row.first_name,
                lastName: row.last_name,
                gender: row.gender,
                birthDate: new Date(row.birth_date),
                about: row.about,
                profilePicture: row.profile_pic ? row.pic_mime_type_prefix + Buffer.from(row.profile_pic, 'base64').toString('base64') : ""
            }
        ));
        return new Response(JSON.stringify(userProfiles), { status: 200 });
    }
    catch (error: any) {
        console.log(error);
        return new Response("Failed to fetch data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * POST endpoint for table user_profile (Create a new profile)
 * 
 * @param {Request} request The incoming HTTP request with UserProfile object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const userProfile: UserProfile = await request.json();
        const picMimeTypePrefix = userProfile.profilePicture ? userProfile.profilePicture.slice(0, userProfile.profilePicture.indexOf(",") + 1) : "";
        const profilePictureUrlBuffer = userProfile.profilePicture ? Buffer.from(userProfile.profilePicture.slice(picMimeTypePrefix.length), 'base64') : null;

        client = await pool.connect();
        
        const userExists = await client.query("SELECT * FROM user_profile WHERE user_name = $1 OR email = $2", [userProfile.username, userProfile.email]);
        console.log("John Pork", userExists.rows.length);
        if (userExists.rows.length >= 1) {
            console.log("Hi");
            return new Response("User already exists", { status: 409 });
        }

        const result = await client.query(
            "INSERT INTO user_profile (user_name, email, first_name, last_name, gender, birth_date, about, profile_pic, pic_mime_type_prefix) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id",
            [userProfile.username, userProfile.email, userProfile.firstName, userProfile.lastName, userProfile.gender, userProfile.birthDate, userProfile.about, profilePictureUrlBuffer, picMimeTypePrefix]
        );
        const id = result.rows[0].user_id;
        return new Response(JSON.stringify({ userId: id }), { status: 201 });
    } 
    catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
    // finally {
    //     if (client) {
    //         client.release();
    //     }
    // }
}

/**
 * PUT endpoint for table user_profile (Update an existing profile)
 * 
 * @param {Request} request The incoming HTTP request with UserProfile object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    try {
        const userProfile: UserProfile = await request.json();
        const picMimeTypePrefix = userProfile.profilePicture ? userProfile.profilePicture.slice(0, userProfile.profilePicture.indexOf(",") + 1) : "";
        const profilePictureUrlBuffer = userProfile.profilePicture ? Buffer.from(userProfile.profilePicture.slice(picMimeTypePrefix.length), 'base64') : null;

        client = await pool.connect();
        await client.query(
            "UPDATE user_profile SET user_name = $2, email = $3, first_name = $4, last_name = $5, gender = $6, birth_date = $7, about = $8, profile_pic = $9, pic_mime_type_prefix = $10 WHERE user_id = $1",
            [userProfile.userId, userProfile.username, userProfile.email, userProfile.firstName, userProfile.lastName, userProfile.gender, userProfile.birthDate, userProfile.about, profilePictureUrlBuffer, picMimeTypePrefix]
        );

        return new Response("OK", { status: 200 });
    } 
    catch (error) {
        return new Response("Failed to update data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * DELETE endpoint for table user_profile (Delete a profile by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the profile to delete
 * @returns {Response} Status code HTTP response
 */
export async function DELETE(request: Request): Promise<Response> {
    let client;
    try {
        const { id } = await request.json();
        client = await pool.connect();
        await client.query("DELETE FROM user_profile WHERE user_id = $1", [id]);

        return new Response("OK", { status: 200 });
    } 
    catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/lib/interfaces";
import pg from "pg";
const { Pool } = pg;

/**
 * Creates a new user in the database with password encryption.
 * 
 * @param {NextRequest} request - The incoming HTTP POST request.
 * 
 * @returns {Response} - The HTTP response object.
 */
export async function POST(request: NextRequest): Promise<Response> {
    try {

        const user: User = await request.json();
        const encryptedPassword = await bcrypt.hash(user.password, 10);

        const pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: 5432,
            database: process.env.DB_NAME,
            ssl: {
                rejectUnauthorized: false,
            },
        });

        const client = await pool.connect();

        //Check if user already exists
        const userExists = await client.query(`SELECT * FROM users WHERE user_name = ${user.username} OR email = ${user.email}`);
        if (userExists.rows.length > 0) {
            return new Response("User already registered", { status: 409 });
        }
        else {
            const result = await client.query(`INSERT INTO users 
                                                (user_name, 
                                                email, 
                                                user_password, 
                                                first_name, 
                                                last_name, 
                                                gender, 
                                                birth_date, 
                                                about, 
                                                date_registered, 
                                                profile_pic)
                                                VALUES (
                                                ${user.username}, 
                                                ${user.email}, 
                                                ${encryptedPassword}, 
                                                ${user.firstName}, 
                                                ${user.lastName}, 
                                                ${user.gender}, 
                                                ${user.birthDate}, 
                                                '',
                                                ${Date.now()},
                                                '')`
                                            );
            client.release();

            return new Response(null, { status: 201 });
        }
    }
    catch (error: any) {
        return new Response("Error registering user", { status: 500 });
    }
}
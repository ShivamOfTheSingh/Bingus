import handleError from "@/lib/errors";
import { NextRequest } from "next/server";
import pg from "pg";
const { Client } = pg;

//get aws data here
export async function GET(request: NextRequest): Promise<Response> {
    try {
        const client = new Client({
            password: "Bingus_LLC",
            host: "bingus-postgres-1.criiocw0mlgp.us-east-2.rds.amazonaws.com",
            post: 5432,
            databse: "Bingus-DB"
        })

        console.log("___________BEFORE CONNECTING______________________")

        await client.connect()

        console.log("____________________AFTER_______________________________")

        return new Response();
    }
    catch (error) {
        return handleError(error);
    }
}
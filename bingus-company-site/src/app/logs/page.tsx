"use server"

import Log from "@/src/components/Log";
import pg from "pg";
const { Pool } = pg;

export default async function Page() {
    const pool = new Pool({
        user: "postgres",
        password: "Bingus_LLC",
        host: "bingus-postgres-1.criiocw0mlgp.us-east-2.rds.amazonaws.com",
        port: 5432,
        database: "bingusdevopsdb",
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const client = await pool.connect();
    const result = await client.query("SELECT * FROM logs_tb");
    client.release();

    const rows: any[] = result.rows;

    return (
        <div>
            {rows.map(row => <Log key={row.id} logDate={row.log_date} name={row.name} logPrevious={row.log_previous} logNext={row.log_next} />)}
        </div>
    );
}
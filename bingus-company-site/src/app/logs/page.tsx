"use server"

import ExpandableContainer from "@/src/components/ExpandableContainer";
import Log from "@/src/components/Log";
import pg from "pg";
const { Pool } = pg;

export default async function Page() {
    const pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const client = await pool.connect();
    const logDates = await client.query("SELECT DISTINCT log_date FROM logs_tb");
    const logs = await client.query("SELECT * FROM logs_tb");
    client.release();

    const logDatesRows: any[] = logDates.rows;
    const logsRows: any[] = logs.rows;

    return (
        <div className="flex flex-col items-center w-full">
            {logDatesRows.map(e1 =>
                <ExpandableContainer 
                    key={e1.log_date} 
                    title={"Daily Log " + e1.log_date.toISOString().split("T")[0]}
                    content={logsRows.filter(e2 => e2.log_date.getTime() == e1.log_date.getTime()).map(e2 => 
                        <Log key={e2.id} logDate={e2.log_date} name={e2.name} logPrevious={e2.log_previous} logNext={e2.log_next} />)} 
                />
            )}
        </div>
    );
}
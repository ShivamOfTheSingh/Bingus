"use server"

import ExpandableContainer from "@/src/components/ExpandableContainer";
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
    const logDates = await client.query("SELECT DISTINCT log_date FROM logs_tb");
    const logs = await client.query("SELECT * FROM logs_tb");
    client.release();

    const logDatesRows: any[] = logDates.rows;
    const logsRows: any[] = logs.rows;

    return (
        <div>
            {logDatesRows.map(e1 => {
                return <ExpandableContainer
                            key={e1.id}
                            title={`Daily Log ${e1}`} 
                            content={logsRows.filter(e2 => e2.date == e1).map(e2 => <Log key={e2.id} logDate={new Date(e2.log_date)} name={e2.name} logPrevious={e2.log_previous} logNext={e2.log_next} />)} 
                    />;
            })}
        </div>
    );
}
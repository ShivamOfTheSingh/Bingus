// Centralized pool so we dont have to authenticate with every single api call
// We simply import this pool and ask it for a client in our api - reducing overhead
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    password: "Bingus_LLC",
    host: "bingus-db-1.c9ayqsiuu3wz.us-east-1.rds.amazonaws.com",
    port: 5432,
    database: "bingus",
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool
// Centralized pool so we dont have to authenticate with every single api call
// We simply import this pool and ask it for a client in our api - reducing overhead
import pg from "pg";
const { Pool } = pg;

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

export default pool
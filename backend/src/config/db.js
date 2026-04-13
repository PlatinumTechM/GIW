import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_NAME,
  max: 10, // connection pool
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

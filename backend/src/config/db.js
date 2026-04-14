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

pool.on("error", (err) => {
  console.error("PostgreSQL connection error:", err.message);
  console.error("Connection details:", {
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    passwordSet: !!process.env.DB_PASS,
  });
});

// Test connection immediately
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("❌ Database test query failed:", err.message);
  } else {
    console.log("✅ Database test query successful");
  }
});

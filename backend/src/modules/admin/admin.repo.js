import { pool } from "../../config/db.js";
  
const verifyAdmin = async (password) => {
  const query = `SELECT id from users 
              WHERE role = 'admin'
              AND password = $1
              LIMIT 1`;
  const result = await pool.query(query, [password]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const query = `SELECT id, name, email, password, company, phone, address,
                 gst, document, is_active, role, created_at
                 FROM users ORDER BY created_at DESC`;
  const result = await pool.query(query);
  return result.rows;
};

export const adminRepo = {
  verifyAdmin,
  getAllUsers
};

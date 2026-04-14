import { pool } from "../../config/db.js";

const findUserByEmail = async (email) => {
  const query = `SELECT id, name, email, company, phone, address, 
                 gst, password, document, is_active, role, created_at 
                 FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `SELECT id, name, email, company, phone, address, 
                 gst, document, is_active, role, created_at 
                 FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const findUserByPhone = async (phone) => {
  const query = `SELECT id, name, email, company, phone, address, 
                 gst, password, document, is_active, role, created_at 
                 FROM users WHERE phone = $1`;
  const result = await pool.query(query, [phone]);
  return result.rows[0];
};

const createUser = async (userData) => {
  const { name, email, company, phone, address, gst, password, document } =
    userData;

  const query = `INSERT INTO users 
    (name, email, company, phone, address, gst, password, document, role) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING id, name, email, company, phone, address, gst, document, role, created_at`;

  const result = await pool.query(query, [
    name,
    email,
    company,
    phone,
    address,
    gst,
    password,
    document || null,
    "user", // Default role
  ]);
  return result.rows[0];
};

const updateUser = async (id, userData) => {
  const { name, company, phone, address, gst } = userData;

  const query = `UPDATE users 
    SET name = $1, company = $2, phone = $3, address = $4, gst = $5
    WHERE id = $6
    RETURNING id, name, email, company, phone, address, gst, document, role, created_at`;

  const result = await pool.query(query, [
    name,
    company,
    phone,
    address,
    gst,
    id,
  ]);
  return result.rows[0];
};

export const authRepo = {
  findUserByEmail,
  findUserById,
  findUserByPhone,
  createUser,
  updateUser,
};

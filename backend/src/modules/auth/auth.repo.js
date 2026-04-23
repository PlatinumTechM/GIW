
import { pool } from "../../config/db.js";

export const findUserByEmail = async (email) => {
  const query = `SELECT id, name, email, company, phone, address, 
                 gst, password, document, is_active, role, created_at 
                 FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const query = `SELECT id, name, email, company, phone, address, 
                 gst, document, is_active, role, created_at 
                 FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const findUserWithSubscription = async (id) => {
  const query = `
    SELECT 
      u.id, u.name, u.email, u.company, u.phone, u.address,
      u.gst, u.document, u.is_active, u.role, u.created_at,
      sp.name as plan_name,
      us.end_date as plan_expiry,
      us.status as subscription_status
    FROM users u
    LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
    LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE u.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const findUserByPhone = async (phone) => {
  const query = `SELECT id, name, email, company, phone, address, 
                 gst, password, document, is_active, role, created_at 
                 FROM users WHERE phone = $1`;
  const result = await pool.query(query, [phone]);
  return result.rows[0];
};

export const createUser = async (userData) => {
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

export const updateUser = async (id, userData) => {
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

// Create user subscription purchase
export const createUserSubscription = async (userId, planId, durationMonths) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + parseInt(durationMonths));

  const query = `
    INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, 'active', NOW(), NOW())
    RETURNING id, user_id, plan_id, start_date, end_date, status, created_at, updated_at
  `;

  const result = await pool.query(query, [userId, planId, startDate, endDate]);
  return result.rows[0];


};
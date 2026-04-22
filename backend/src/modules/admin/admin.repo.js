import { pool } from "../../config/db.js";

export const verifyAdmin = async (password) => {
  const query = `SELECT id from users 
              WHERE role = 'admin'
              AND password = $1
              LIMIT 1`;
  const result = await pool.query(query, [password]);
  return result.rows[0];
};

export const getAllUsers = async () => {
  const query = `SELECT id, name, email, password, company, phone, address,
                 gst, document, is_active, role, created_at
                 FROM users ORDER BY created_at DESC`;
  const result = await pool.query(query);
  return result.rows;
};

// Get all subscription plans
export const getSubscriptions = async () => {
  const query = `SELECT id, name, duration_month, price, stock_limit, is_active, 
                        has_diamonds, has_jewellery, description, created_at
                 FROM subscription_plans ORDER BY name ASC, duration_month ASC`;
  const result = await pool.query(query);
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    durationMonth: row.duration_month,
    price: parseFloat(row.price),
    stockLimit: row.stock_limit,
    hasDiamonds: row.has_diamonds,
    hasJewellery: row.has_jewellery,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
};

// Create subscription plan
export const createSubscription = async (data) => {
  const {
    name,
    durationMonth,
    price,
    stockLimit,
    hasDiamonds,
    hasJewellery,
    description,
  } = data;
  const query = `INSERT INTO subscription_plans (name, duration_month, price, stock_limit, has_diamonds, has_jewellery, description)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id, name, duration_month, price, stock_limit, has_diamonds, has_jewellery, description, is_active, created_at`;
  const result = await pool.query(query, [
    name,
    durationMonth,
    price,
    stockLimit,
    hasDiamonds ?? false,
    hasJewellery ?? false,
    description || null,
  ]);
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    durationMonth: row.duration_month,
    price: parseFloat(row.price),
    stockLimit: row.stock_limit,
    hasDiamonds: row.has_diamonds,
    hasJewellery: row.has_jewellery,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
};

// Update subscription plan
export const updateSubscription = async (id, data) => {
  const {
    name,
    durationMonth,
    price,
    stockLimit,
    hasDiamonds,
    hasJewellery,
    description,
    isActive,
  } = data;
  const query = `UPDATE subscription_plans
                 SET name = $1, duration_month = $2, price = $3, stock_limit = $4, 
                     has_diamonds = $5, has_jewellery = $6, description = $7, is_active = $8
                 WHERE id = $9
                 RETURNING id, name, duration_month, price, stock_limit, has_diamonds, has_jewellery, description, is_active, created_at`;
  const result = await pool.query(query, [
    name,
    durationMonth,
    price,
    stockLimit,
    hasDiamonds ?? false,
    hasJewellery ?? false,
    description || null,
    isActive ?? true,
    id,
  ]);
  if (result.rows.length === 0) {
    throw new Error("Subscription not found");
  }
  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    durationMonth: row.duration_month,
    price: parseFloat(row.price),
    stockLimit: row.stock_limit,
    hasDiamonds: row.has_diamonds,
    hasJewellery: row.has_jewellery,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
};

// Delete subscription
export const deleteSubscription = async (id) => {
  const query = `DELETE FROM subscription_plans WHERE id = $1 RETURNING id`;
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    throw new Error("Subscription not found");
  }
  return { success: true };
};

// Check if plan with same name and duration already exists
export const checkDuplicatePlan = async (
  name,
  durationMonth,
  excludeId = null,
) => {
  let query = `SELECT id FROM subscription_plans WHERE name = $1 AND duration_month = $2`;
  const params = [name, durationMonth];

  if (excludeId) {
    query += ` AND id != $3`;
    params.push(excludeId);
  }

  const result = await pool.query(query, params);
  return result.rows.length > 0;
};

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
  const query = `
    SELECT 
      u.id, u.name, u.email, u.password, u.company, u.phone, u.address,
      u.gst, u.document, u.is_active, u.role, u.created_at,
      sp.name as plan_name,
      us.end_date as plan_expiry,
      us.status as subscription_status
    FROM users u
    LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
    LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
    ORDER BY u.created_at DESC
  `;
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

// Get only active subscription plans (for public pricing page)
const getActiveSubscriptions = async () => {
  const query = `SELECT id, name, duration_month, price, stock_limit, is_active,
                        has_diamonds, has_jewellery, description, created_at
                 FROM subscription_plans
                 WHERE is_active = true
                 ORDER BY name ASC, duration_month ASC`;
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

// Get all subscription buyers with user and plan details
const getSubscriptionBuyers = async () => {
  const query = `
    SELECT 
      us.id as subscription_id,
      us.user_id,
      us.plan_id,
      us.start_date,
      us.end_date,
      us.status,
      us.created_at as purchase_date,
      u.name as user_name,
      u.email as user_email,
      u.company as user_company,
      u.phone as user_phone,
      sp.name as plan_name,
      sp.duration_month,
      sp.price
    FROM user_subscriptions us
    JOIN users u ON us.user_id = u.id
    JOIN subscription_plans sp ON us.plan_id = sp.id
    ORDER BY us.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Update user plan (admin only)
export const updateUserPlan = async (userId, planId, durationMonths) => {
  // First, cancel any existing active subscription for the user
  const deactivateQuery = `
    UPDATE user_subscriptions 
    SET status = 'cancelled', updated_at = NOW()
    WHERE user_id = $1 AND status = 'active'
  `;
  await pool.query(deactivateQuery, [userId]);

  // If planId is null, just cancel (remove plan)
  if (!planId) {
    return { success: true, message: "User plan removed successfully" };
  }

  // Create new subscription
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + parseInt(durationMonths));

  const insertQuery = `
    INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, 'active', NOW(), NOW())
    RETURNING id, user_id, plan_id, start_date, end_date, status
  `;
  const result = await pool.query(insertQuery, [userId, planId, startDate, endDate]);
  
  return result.rows[0];
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

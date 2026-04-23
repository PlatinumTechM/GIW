
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
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Get plan details for stock limit
    const planQuery = `SELECT stock_limit FROM subscription_plans WHERE id = $1`;
    const planResult = await client.query(planQuery, [planId]);
    
    if (planResult.rows.length === 0) {
      throw new Error("Plan not found");
    }
    
    const stockLimit = planResult.rows[0].stock_limit;

    // Check if user has more stocks than the new plan's limit
    const currentUsageQuery = `SELECT uploaded FROM subscription_usage WHERE user_id = $1`;
    const usageResult = await client.query(currentUsageQuery, [userId]);
    const uploadedCount = usageResult.rows.length > 0 ? parseInt(usageResult.rows[0].uploaded || 0) : 0;

    if (uploadedCount > stockLimit) {
      throw new Error(`Cannot purchase this plan. You have ${uploadedCount} stocks uploaded, which exceeds the new plan's limit of ${stockLimit}. Please delete some stocks before downgrading.`);
    }

    // Deactivate any existing active subscription for the user
    const deactivateQuery = `
      UPDATE user_subscriptions 
      SET status = 'cancelled', updated_at = NOW()
      WHERE user_id = $1 AND status = 'active'
    `;
    await client.query(deactivateQuery, [userId]);

    // Create new subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(durationMonths));

    const insertQuery = `
      INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'active', NOW(), NOW())
      RETURNING id, user_id, plan_id, start_date, end_date, status, created_at, updated_at
    `;

    const result = await client.query(insertQuery, [userId, planId, startDate, endDate]);
    const subscription = result.rows[0];

    // Update or Insert into subscription_usage
    const checkUsageQuery = `SELECT id FROM subscription_usage WHERE user_id = $1`;
    const usageCheck = await client.query(checkUsageQuery, [userId]);

    if (usageCheck.rows.length > 0) {
      // Update existing usage record with new limit and subscription ID
      const updateUsageQuery = `
        UPDATE subscription_usage 
        SET subscription_id = $1, total_limit = $2, updated_at = NOW()
        WHERE user_id = $3
      `;
      await client.query(updateUsageQuery, [subscription.id, stockLimit, userId]);

    } else {
      // Insert new usage record
      const insertUsageQuery = `
        INSERT INTO subscription_usage (user_id, subscription_id, total_limit, uploaded)
        VALUES ($1, $2, $3, 0)
      `;
      await client.query(insertUsageQuery, [userId, subscription.id, stockLimit]);

    }

    await client.query("COMMIT");
    return subscription;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
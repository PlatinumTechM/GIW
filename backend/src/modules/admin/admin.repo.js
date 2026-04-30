import { pool } from "../../config/db.js";

export const verifyAdmin = async (password) => {
  const query = `SELECT id from users 
              WHERE role = 'admin'
              AND password = $1
              LIMIT 1`;
  const result = await pool.query(query, [password]);
  return result.rows[0];
};

export const getAllUsers = async (search = "") => {
  let query = `
    SELECT 
      u.id, u.name, u.email, u.password, u.company, u.phone, u.address,
      u.gst, u.document, u.is_active, u.role, u.type, u.created_at,
      sp.name as plan_name,
      us.end_date as plan_expiry,
      us.status as subscription_status,
      su.uploaded as stock_count,
      su.total_limit as stock_limit
    FROM users u
    LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
    LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
    LEFT JOIN subscription_usage su ON u.id = su.user_id
    WHERE u.role != 'admin'
  `;

  const params = [];
  let paramCount = 0;

  if (search && search.trim()) {
    const searchTerm = search.trim().toLowerCase();
    paramCount++;
    query += ` AND (
      LOWER(u.name) LIKE $${paramCount} OR
      LOWER(u.email) LIKE $${paramCount} OR
      LOWER(u.company) LIKE $${paramCount}
    )`;
    params.push(`${searchTerm}%`);
  }

  query += ` ORDER BY u.created_at DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

// Get all subscription plans
export const getSubscriptions = async () => {
  const query = `SELECT id, name, duration_month, price, stock_limit, is_active,
                        has_diamonds, has_jewellery, has_share_link, description, created_at
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
    hasShareLink: row.has_share_link,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
};

// Get only active subscription plans (for public pricing page)
export const getActiveSubscriptions = async () => {
  const query = `SELECT id, name, duration_month, price, stock_limit, is_active,
                        has_diamonds, has_jewellery, has_share_link, description, created_at
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
    hasShareLink: row.has_share_link,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
  }));
};

// Create subscription plan
export const createSubscription = async (data) => {
  const { name, durationMonth, price, stockLimit, hasDiamonds, hasJewellery, hasShareLink, description } = data;
  const query = `INSERT INTO subscription_plans (name, duration_month, price, stock_limit, has_diamonds, has_jewellery, has_share_link, description)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING id, name, duration_month, price, stock_limit, has_diamonds, has_jewellery, has_share_link, description, is_active, created_at`;
  const result = await pool.query(query, [
    name,
    durationMonth,
    price,
    stockLimit,
    hasDiamonds ?? false,
    hasJewellery ?? false,
    hasShareLink ?? false,
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
    hasShareLink: row.has_share_link,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
};

// Update subscription plan
export const updateSubscription = async (id, data) => {
  const { name, durationMonth, price, stockLimit, hasDiamonds, hasJewellery, hasShareLink, description, isActive } = data;
  const query = `UPDATE subscription_plans
                 SET name = $1, duration_month = $2, price = $3, stock_limit = $4, 
                     has_diamonds = $5, has_jewellery = $6, has_share_link = $7, description = $8, is_active = $9
                 WHERE id = $10
                 RETURNING id, name, duration_month, price, stock_limit, has_diamonds, has_jewellery, has_share_link, description, is_active, created_at`;
  const result = await pool.query(query, [
    name,
    durationMonth,
    price,
    stockLimit,
    hasDiamonds ?? false,
    hasJewellery ?? false,
    hasShareLink ?? false,
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
    hasShareLink: row.has_share_link,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
};

// Delete subscription
export const deleteSubscription = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Check if any user has an ACTIVE purchase of this plan
    const checkQuery = `SELECT id FROM user_subscriptions WHERE plan_id = $1 AND status = 'active' LIMIT 1`;
    const checkResult = await client.query(checkQuery, [id]);

    if (checkResult.rows.length > 0) {
      throw new Error("This plan cannot be deleted because it is currently being used by active subscribers. Please deactivate it instead.");
    }

    // 2. Delete from subscription_usage that points to user_subscriptions of this plan
    const deleteUsageQuery = `
      DELETE FROM subscription_usage 
      WHERE subscription_id IN (SELECT id FROM user_subscriptions WHERE plan_id = $1)
    `;
    await client.query(deleteUsageQuery, [id]);

    // 3. Delete from user_subscriptions for this plan (now that usage records are gone)
    const deleteUserSubQuery = `DELETE FROM user_subscriptions WHERE plan_id = $1`;
    await client.query(deleteUserSubQuery, [id]);

    // 4. Finally delete the plan itself
    const deletePlanQuery = `DELETE FROM subscription_plans WHERE id = $1 RETURNING id`;
    const result = await client.query(deletePlanQuery, [id]);

    if (result.rows.length === 0) {
      throw new Error("Subscription not found");
    }

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Get all subscription buyers with user and plan details
export const getSubscriptionBuyers = async () => {
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
      u.type as user_type,
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
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // If planId is null, just cancel (remove plan)
    if (!planId) {
      // First, cancel any existing active subscription for the user
      const deactivateQuery = `
        UPDATE user_subscriptions 
        SET status = 'cancelled', updated_at = NOW()
        WHERE user_id = $1 AND status = 'active'
      `;
      await client.query(deactivateQuery, [userId]);

      // Also update subscription_usage to 0 limit
      await client.query(
        "UPDATE subscription_usage SET total_limit = 0, subscription_id = NULL, updated_at = NOW() WHERE user_id = $1",
        [userId]
      );
      await client.query("COMMIT");
      return { success: true, message: "User plan removed successfully" };
    }

    // Get new plan details for stock limit
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
      throw new Error(`Cannot change to this plan. User has ${uploadedCount} stocks uploaded, which exceeds the new plan's limit of ${stockLimit}. Please delete some stocks first.`);
    }

    // Now, cancel any existing active subscription for the user
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
      RETURNING id, user_id, plan_id, start_date, end_date, status
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

// Check if plan with same name and duration already exists
export const checkDuplicatePlan = async (name, durationMonth, excludeId = null) => {
  let query = `SELECT id FROM subscription_plans WHERE name = $1 AND duration_month = $2`;
  const params = [name, durationMonth];

  if (excludeId) {
    query += ` AND id != $3`;
    params.push(excludeId);
  }

  const result = await pool.query(query, params);
  return result.rows.length > 0;
};

// Update user status (active/inactive)
export const updateUserStatus = async (userId, isActive) => {
  const query = `UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, is_active`;
  const result = await pool.query(query, [isActive, userId]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  return result.rows[0];
};

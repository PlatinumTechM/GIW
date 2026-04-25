import { pool } from "../../../config/db.js";

export const createShareApiKey = async (data) => {
  const {
    userId,
    name,
    email,
    discountPercentage,
    includeCategory,
    excludeCategory,
    allowHold,
    allowSell,
    allowInsert,
    allowUpdate,
    apiToken,
  } = data;

  const result = await pool.query(
    `INSERT INTO share_api (
      user_id, name, email, discount_percentage, 
      include_category, exclude_category, 
      allow_hold, allow_sell, allow_insert, allow_update, 
      api_token
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      userId,
      name,
      email,
      discountPercentage || 0,
      includeCategory || null,
      excludeCategory || null,
      allowHold || false,
      allowSell || false,
      allowInsert || false,
      allowUpdate || false,
      apiToken,
    ]
  );

  return result.rows[0];
};

export const getShareApiKeyByToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM share_api WHERE api_token = $1`,
    [token]
  );
  return result.rows[0] || null;
};

export const getShareApiKeysByUserId = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const countResult = await pool.query(
    `SELECT COUNT(*) as count FROM share_api WHERE user_id = $1`,
    [userId]
  );
  
  const result = await pool.query(
    `SELECT * FROM share_api WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  
  return {
    keys: result.rows,
    total: parseInt(countResult.rows[0].count)
  };
};

export const getStockForApiKey = async (apiKey, queryParams = {}) => {
  const {
    user_id,
    discount_percentage,
    include_category,
    exclude_category,
  } = apiKey;

  const baseConditions = [`user_id = $1`];
  const values = [user_id];
  let paramIndex = 2;

  // Apply Include Category filter if set
  if (include_category) {
    const categories = include_category.split(",").map(c => c.trim().toUpperCase());
    const placeholders = categories.map((_, i) => `$${paramIndex + i}`).join(",");
    baseConditions.push(`UPPER(shape) IN (${placeholders})`);
    values.push(...categories);
    paramIndex += categories.length;
  }

  // Apply Exclude Category filter if set
  if (exclude_category) {
    const categories = exclude_category.split(",").map(c => c.trim().toUpperCase());
    const placeholders = categories.map((_, i) => `$${paramIndex + i}`).join(",");
    baseConditions.push(`UPPER(shape) NOT IN (${placeholders})`);
    values.push(...categories);
    paramIndex += categories.length;
  }

  const whereClause = baseConditions.length > 0 ? `WHERE ${baseConditions.join(" AND ")}` : "";

  // Pagination
  const page = parseInt(queryParams.page) || 1;
  const limit = Math.min(parseInt(queryParams.limit) || 50, 100);
  const offset = (page - 1) * limit;

  // Get total count
  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM diamond_stock ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].total);

  // Get stock data
  // Only return non-sensitive columns
  const columns = [
    "id", "type", "stock_id", "certificate_number", "weight", "shape", "color",
    "clarity", "cut", "polish", "symmetry", "fluorescence", "measurements",
    "lab", "status", "diamond_image1", "diamond_video", "certificate_image",
    "price_per_carat" // Needed for discount calculation
  ];

  const dataResult = await pool.query(
    `SELECT ${columns.join(", ")} FROM diamond_stock
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...values, limit, offset]
  );

  let stocks = dataResult.rows;

  // Apply discount/markup
  if (discount_percentage !== 0) {
    stocks = stocks.map(stock => ({
      ...stock,
      price_per_carat: stock.price_per_carat
        ? Math.round(stock.price_per_carat * (1 + discount_percentage / 100) * 100) / 100
        : null
    }));
  }

  return {
    stocks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const updateShareApiKeyStatus = async (id, userId, isActive) => {
  const result = await pool.query(
    `UPDATE share_api SET is_active = $1, updated_at = NOW() 
     WHERE id = $2 AND user_id = $3 
     RETURNING *`,
    [isActive, id, userId]
  );
  return result.rows[0] || null;
};

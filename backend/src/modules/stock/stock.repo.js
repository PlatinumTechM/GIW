import { pool } from "../../config/db.js";

// All columns from diamond_stock table

const ALL_COLUMNS = [
  "type",
  "user_id",
  "stock_id",
  "certificate_number",
  "weight",

  "shape",
  "color",
  "fancy_color",
  "fancy_color_intensity",
  "fancy_color_overtone",

  "clarity",
  "cut",
  "polish",
  "symmetry",
  "fluorescence",
  "fluorescence_color",
  "fluorescence_intensity",

  "measurements",
  "length",
  "width",
  "height",

  "shade",
  "milky",
  "eye_clean",
  "lab",
  "certificate_comment",

  "city",
  "state",
  "country",
  "treatment",

  "depth_percentage",
  "table_percentage",

  "rap_per_carat",
  "price_per_carat",
  "final_price",
  "dollar_rate",
  "rs_amount",
  "discount",

  "heart_arrow",
  "star_length",
  "laser_description",
  "growth_type",
  "key_to_symbol",
  "lw_ratio",

  "culet_size",
  "culet_condition",

  "gridle_thin",
  "gridle_thick",
  "gridle_condition",
  "gridle_per",

  "crown_height",
  "crown_angle",
  "pavilion_depth",
  "pavilion_angle",

  "status",
  "diamond_type",

  "diamond_image1",
  "diamond_image2",
  "diamond_image3",
  "diamond_image4",
  "diamond_image5",

  "diamond_video",
  "certificate_image",
];

export const bulkInsert = async (stockDataArray, client = null) => {
  if (stockDataArray.length === 0) return 0;

  // Get only columns that have data in at least one row
  const columnsWithData = ALL_COLUMNS.filter((col) =>
    stockDataArray.some((row) => row[col] !== null && row[col] !== undefined),
  );

  const placeholders = stockDataArray
    .map((_, rowIndex) => {
      const rowPlaceholders = columnsWithData
        .map(
          (_, colIndex) =>
            `$${rowIndex * columnsWithData.length + colIndex + 1}`,
        )
        .join(", ");
      return `(${rowPlaceholders})`;
    })
    .join(", ");

  const values = stockDataArray.flatMap((stock) =>
    columnsWithData.map((col) => stock[col]),
  );

  const query = `
    INSERT INTO diamond_stock (${columnsWithData.join(", ")})
    VALUES ${placeholders}
    RETURNING id
  `;

  try {
    const result = client
      ? await client.query(query, values)
      : await pool.query(query, values);
    return result.rowCount;
  } catch (error) {
    console.error("[bulkInsert] SQL Error:", error.message);
    throw error;
  }
};

export const getAll = async (page, limit, filters) => {
  const offset = (page - 1) * limit;

  const whereConditions = [];

  const values = [];

  let paramIndex = 1;

  if (filters.shape) {
    whereConditions.push(`shape ILIKE $${paramIndex}`);

    values.push(`%${filters.shape}%`);

    paramIndex++;
  }

  if (filters.color) {
    whereConditions.push(`color ILIKE $${paramIndex}`);

    values.push(`%${filters.color}%`);

    paramIndex++;
  }

  if (filters.clarity) {
    whereConditions.push(`clarity ILIKE $${paramIndex}`);

    values.push(`%${filters.clarity}%`);

    paramIndex++;
  }

  if (filters.status) {
    whereConditions.push(`status = $${paramIndex}`);

    values.push(filters.status);

    paramIndex++;
  }

  if (filters.minWeight) {
    whereConditions.push(`weight >= $${paramIndex}`);

    values.push(filters.minWeight);

    paramIndex++;
  }

  if (filters.maxWeight) {
    whereConditions.push(`weight <= $${paramIndex}`);

    values.push(filters.maxWeight);

    paramIndex++;
  }

  if (filters.minPrice) {
    whereConditions.push(`final_price >= $${paramIndex}`);

    values.push(filters.minPrice);

    paramIndex++;
  }

  if (filters.maxPrice) {
    whereConditions.push(`final_price <= $${paramIndex}`);

    values.push(filters.maxPrice);

    paramIndex++;
  }

  if (filters.search) {
    whereConditions.push(`(

      shape ILIKE $${paramIndex} OR

      color ILIKE $${paramIndex} OR

      clarity ILIKE $${paramIndex} OR

      lab ILIKE $${paramIndex}

    )`);

    values.push(`%${filters.search}%`);

    paramIndex++;
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const countQuery = `SELECT COUNT(*) FROM diamond_stock ${whereClause}`;

  const countResult = await pool.query(countQuery, values);

  const totalCount = parseInt(countResult.rows[0].count);

  const dataQuery = `
    SELECT
     id, type, user_id, stock_id, certificate_number, weight, shape, color,
      fancy_color, fancy_color_intensity, fancy_color_overtone, clarity, cut, polish,
      symmetry, fluorescence, fluorescence_color, fluorescence_intensity, measurements, 
      length, width, height, shade, milky, eye_clean, lab, certificate_comment, city,
      state, country, treatment, depth_percentage, table_percentage, rap_price,
      rap_per_carat, price_per_carat, final_price, discount, heart_arrow, star_length,
      laser_description, growth_type, key_to_symbol, lw_ratio, culet_size, culet_condition,
      gridle_thin, gridle_thick, gridle_condition, gridle_per, crown_height, crown_angle,
      pavilion_depth, pavilion_angle, status, diamond_image1, diamond_video, certificate_image
    FROM diamond_stock
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}

  `;

  values.push(limit, offset);

  const dataResult = await pool.query(dataQuery, values);

  return {
    stocks: dataResult.rows,

    pagination: {
      page,

      limit,

      totalCount,

      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getById = async (id) => {
  const query = "SELECT * FROM diamond_stock WHERE id = $1";

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};

export const create = async (stockData) => {
  const columns = Object.keys(stockData);

  const values = Object.values(stockData);

  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

  const query = `

    INSERT INTO diamond_stock (${columns.join(", ")})
    VALUES (${placeholders})
    RETURNING *

  `;

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const update = async (id, stockData) => {
  const columns = Object.keys(stockData);

  const values = Object.values(stockData);

  if (columns.length === 0) {
    throw new Error("No fields to update");
  }

  const setClause = columns

    .map((col, i) => `${col} = $${i + 1}`)

    .join(", ");

  const query = `

    UPDATE diamond_stock

    SET ${setClause}, updated_at = CURRENT_TIMESTAMP

    WHERE id = $${values.length + 1}

    RETURNING *

  `;

  const result = await pool.query(query, [...values, id]);

  return result.rows[0];
};

export const deleteStock = async (id) => {
  const query = "DELETE FROM diamond_stock WHERE id = $1 RETURNING *";

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

// Delete stocks by stock_id array (for bulk replace)

export const deleteByStockIds = async (stockIds, client = null) => {
  if (stockIds.length === 0) return 0;

  const placeholders = stockIds.map((_, i) => `$${i + 1}`).join(", ");
  const query = `DELETE FROM diamond_stock WHERE stock_id IN (${placeholders})`;

  const result = client
    ? await client.query(query, stockIds)
    : await pool.query(query, stockIds);

  return result.rowCount;
};

// Get stocks by user_id

export const getByUserId = async (userId, page = 1, limit = 50) => {
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) FROM diamond_stock WHERE user_id = $1`;

  const countResult = await pool.query(countQuery, [userId]);

  const totalCount = parseInt(countResult.rows[0].count);

  const dataQuery = `
    SELECT
      id, type, user_id, stock_id, certificate_number, weight, shape, color,
      fancy_color, fancy_color_intensity, fancy_color_overtone, clarity, cut, polish,
      symmetry, fluorescence, fluorescence_color, fluorescence_intensity, measurements, 
      length, width, height, shade, milky, eye_clean, lab, certificate_comment, city,
      state, country, treatment, depth_percentage, table_percentage, rap_price,
      rap_per_carat, price_per_carat, final_price, discount, heart_arrow, star_length,
      laser_description, growth_type, key_to_symbol, lw_ratio, culet_size, culet_condition,
      gridle_thin, gridle_thick, gridle_condition, gridle_per, crown_height, crown_angle,
      pavilion_depth, pavilion_angle, status, diamond_image1, diamond_video, certificate_image
    FROM diamond_stock
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const dataResult = await pool.query(dataQuery, [userId, limit, offset]);

  return {
    stocks: dataResult.rows,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export { ALL_COLUMNS };

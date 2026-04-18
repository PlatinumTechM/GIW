import { pool } from "../../config/db.js";
import { buildStockFilters, getSortConfig, buildWhereClause } from "./stock.filter.js";

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

  // Build filters using filter module
  const { whereConditions, values, paramIndex } = buildStockFilters(filters, 1);
  const whereClause = buildWhereClause(whereConditions);
  const { sortBy, sortOrder } = getSortConfig(filters);

  // Count query
  const countQuery = `SELECT COUNT(*) FROM diamond_stock ${whereClause}`;
  const countResult = await pool.query(countQuery, values);
  const totalCount = parseInt(countResult.rows[0].count);

  // Data query
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
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const dataValues = [...values, limit, offset];
  const dataResult = await pool.query(dataQuery, dataValues);

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

// Get stocks by user_id with filters and sorting
export const getByUserId = async (userId, page = 1, limit = 50, filters = {}) => {
  const offset = (page - 1) * limit;

  // Build filters using filter module (startIndex=2 because $1 is user_id)
  const baseConditions = [`user_id = $1`];
  const baseValues = [userId];
  const { whereConditions, values, paramIndex } = buildStockFilters(filters, 2, baseConditions);

  // Combine base values with filter values
  const allValues = [...baseValues, ...values];

  const whereClause = buildWhereClause(whereConditions);
  const { sortBy, sortOrder } = getSortConfig(filters);

  // Count query
  const countQuery = `SELECT COUNT(*) FROM diamond_stock ${whereClause}`;
  const countResult = await pool.query(countQuery, allValues);
  const totalCount = parseInt(countResult.rows[0].count);

  // Data query
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
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const dataValues = [...allValues, limit, offset];
  const dataResult = await pool.query(dataQuery, dataValues);

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

export const getFilterOptions = async () => {
  const shapeQuery = `SELECT DISTINCT UPPER(shape) as value FROM diamond_stock WHERE shape IS NOT NULL AND shape != '' ORDER BY value`;
  const colorQuery = `SELECT DISTINCT UPPER(color) as value FROM diamond_stock WHERE color IS NOT NULL AND color != '' ORDER BY value`;
  const fancyColorQuery = `SELECT DISTINCT UPPER(fancy_color) as value FROM diamond_stock WHERE fancy_color IS NOT NULL AND fancy_color != '' ORDER BY value`;
  const clarityQuery = `SELECT DISTINCT UPPER(clarity) as value FROM diamond_stock WHERE clarity IS NOT NULL AND clarity != '' ORDER BY value`;

  const [shapeResult, colorResult, fancyColorResult, clarityResult] = await Promise.all([
    pool.query(shapeQuery),
    pool.query(colorQuery),
    pool.query(fancyColorQuery),
    pool.query(clarityQuery),
  ]);

  // Combine colors and fancy colors, remove duplicates
  const dbColors = colorResult.rows.map((r) => r.value);
  const dbFancyColors = fancyColorResult.rows.map((r) => r.value);
  const allColors = [...new Set([...dbColors, ...dbFancyColors])];

  return {
    shapes: shapeResult.rows.map((r) => r.value),
    colors: allColors,
    clarities: clarityResult.rows.map((r) => r.value),
  };
};

export { ALL_COLUMNS };

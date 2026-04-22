import { pool } from "../../config/db.js";
import {
  buildStockFilters,
  getSortConfig,
  buildWhereClause,
} from "./stock.filter.js";

/**
 * Map frontend filter values to database codes
 * Ideal -> ID, Excellent -> EX, Very Good -> VG
 * Good, Fair, Poor remain as-is
 * @param {string} value - Filter value from frontend
 * @returns {string} - Mapped database code
 */
const mapFilterValue = (value) => {
  const upperValue = value.toUpperCase().trim();
  const mappings = {
    IDEAL: "ID",
    EXCELLENT: "EX",
    "VERY GOOD": "VG",
  };
  return mappings[upperValue] || value.trim();
};

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

  // PostgreSQL has a limit of 32767 parameters per query
  // Calculate max rows per batch based on number of columns
  const maxParams = 32767;
  const maxRowsPerBatch = Math.floor(maxParams / columnsWithData.length);
  const batchSize = Math.min(maxRowsPerBatch, 1000); // Also cap at 1000 rows for memory efficiency

  let totalInserted = 0;

  // Process in batches
  for (let i = 0; i < stockDataArray.length; i += batchSize) {
    const batch = stockDataArray.slice(i, i + batchSize);

    const placeholders = batch
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

    const values = batch.flatMap((stock) =>
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
      totalInserted += result.rowCount;
    } catch (error) {
      console.error("[bulkInsert] SQL Error:", error.message);
      throw error;
    }
  }

  return totalInserted;
};

export const getAll = async (page, limit, sortBy, filters) => {
  const offset = (page - 1) * limit;
  const whereConditions = [];
  const values = [];
  let paramIndex = 1;

  // Sort mapping
  const sortMapping = {
    featured: "created_at DESC",
    "price-low": "final_price ASC",
    "price-high": "final_price DESC",
    "carat-low": "weight ASC",
    "carat-high": "weight DESC",
    color: "color ASC",
  };
  const orderBy = sortMapping[sortBy] || "created_at DESC";

  // Array filters (comma-separated values)
  if (filters.shape) {
    const shapes = filters.shape.split(",").map((s) => s.trim().toUpperCase());
    const placeholders = shapes.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(shape) IN (${placeholders})`);
    values.push(...shapes);
    paramIndex += shapes.length;
  }

  if (filters.color) {
    const colors = filters.color.split(",").map((c) => c.trim().toUpperCase());
    const placeholders = colors.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(color) IN (${placeholders})`);
    values.push(...colors);
    paramIndex += colors.length;
  }

  if (filters.clarity) {
    const clarities = filters.clarity
      .split(",")
      .map((c) => c.trim().toUpperCase());
    const placeholders = clarities
      .map((_, i) => `$${paramIndex + i}`)
      .join(", ");
    whereConditions.push(`UPPER(clarity) IN (${placeholders})`);
    values.push(...clarities);
    paramIndex += clarities.length;
  }

  if (filters.cut) {
    const cuts = filters.cut
      .split(",")
      .map((c) => mapFilterValue(c).toUpperCase());
    const placeholders = cuts.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(cut) IN (${placeholders})`);
    values.push(...cuts);
    paramIndex += cuts.length;
  }

  if (filters.polish) {
    const polishes = filters.polish
      .split(",")
      .map((p) => mapFilterValue(p).toUpperCase());
    const placeholders = polishes
      .map((_, i) => `$${paramIndex + i}`)
      .join(", ");
    whereConditions.push(`UPPER(polish) IN (${placeholders})`);
    values.push(...polishes);
    paramIndex += polishes.length;
  }

  if (filters.symmetry) {
    const symmetries = filters.symmetry
      .split(",")
      .map((s) => mapFilterValue(s).toUpperCase());
    const placeholders = symmetries
      .map((_, i) => `$${paramIndex + i}`)
      .join(", ");
    whereConditions.push(`UPPER(symmetry) IN (${placeholders})`);
    values.push(...symmetries);
    paramIndex += symmetries.length;
  }

  if (filters.fluorescence) {
    const flours = filters.fluorescence
      .split(",")
      .map((f) => f.trim().toUpperCase());
    const placeholders = flours.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(fluorescence) IN (${placeholders})`);
    values.push(...flours);
    paramIndex += flours.length;
  }

  if (filters.lab) {
    const normalizeLabValue = (v) =>
      v
        .toString()
        .trim()
        .replace(/[\s_-]+/g, " ")
        .toUpperCase();

    const rawLabs = filters.lab
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    const labs = rawLabs.map(normalizeLabValue).filter(Boolean);

    const hasNonCertified = labs.includes("NON CERTIFIED");
    const selectedLabs = labs.filter((l) => l !== "NON CERTIFIED");
    const nonCertifiedCondition =
      "(certificate_number IS NULL OR TRIM(certificate_number) = '')";

    if (hasNonCertified && selectedLabs.length === 0) {
      whereConditions.push(nonCertifiedCondition);
    } else if (!hasNonCertified && selectedLabs.length > 0) {
      const placeholders = selectedLabs
        .map((_, i) => `$${paramIndex + i}`)
        .join(", ");
      whereConditions.push(`UPPER(lab) IN (${placeholders})`);
      values.push(...selectedLabs);
      paramIndex += selectedLabs.length;
    } else if (hasNonCertified && selectedLabs.length > 0) {
      const placeholders = selectedLabs
        .map((_, i) => `$${paramIndex + i}`)
        .join(", ");
      whereConditions.push(
        `(UPPER(lab) IN (${placeholders}) OR ${nonCertifiedCondition})`,
      );
      values.push(...selectedLabs);
      paramIndex += selectedLabs.length;
    }
  }

  // Fancy color filters (can be comma-separated for multiple)
  if (filters.fancyColor) {
    const fancyColors = filters.fancyColor.split(",").map((c) => c.trim());
    if (fancyColors.length === 1) {
      whereConditions.push(`fancy_color ILIKE $${paramIndex}`);
      values.push(`%${fancyColors[0]}%`);
      paramIndex++;
    } else {
      const placeholders = fancyColors
        .map((_, i) => `$${paramIndex + i}`)
        .join(", ");
      whereConditions.push(`fancy_color ILIKE ANY(ARRAY[${placeholders}])`);
      values.push(...fancyColors.map((c) => `%${c}%`));
      paramIndex += fancyColors.length;
    }
  }

  if (filters.fancyIntensity) {
    const intensities = filters.fancyIntensity
      .split(",")
      .map((i) => i.trim().toUpperCase());
    if (intensities.length === 1) {
      whereConditions.push(`UPPER(fancy_color_intensity) = $${paramIndex}`);
      values.push(intensities[0]);
      paramIndex++;
    } else {
      const placeholders = intensities
        .map((_, i) => `$${paramIndex + i}`)
        .join(", ");
      whereConditions.push(`UPPER(fancy_color_intensity) IN (${placeholders})`);
      values.push(...intensities);
      paramIndex += intensities.length;
    }
  }

  if (filters.fancyOvertone) {
    const overtones = filters.fancyOvertone
      .split(",")
      .map((o) => o.trim().toUpperCase());
    if (overtones.length === 1) {
      whereConditions.push(`UPPER(fancy_color_overtone) = $${paramIndex}`);
      values.push(overtones[0]);
      paramIndex++;
    } else {
      const placeholders = overtones
        .map((_, i) => `$${paramIndex + i}`)
        .join(", ");
      whereConditions.push(`UPPER(fancy_color_overtone) IN (${placeholders})`);
      values.push(...overtones);
      paramIndex += overtones.length;
    }
  }

  // Status/Availability
  if (filters.status) {
    whereConditions.push(`status = $${paramIndex}`);
    values.push(filters.status);
    paramIndex++;
  }

  if (filters.availability) {
    whereConditions.push(`status = $${paramIndex}`);
    values.push(filters.availability);
    paramIndex++;
  }

  // Range filters - Carat (weight)
  if (filters.minCarat) {
    whereConditions.push(`weight >= $${paramIndex}`);
    values.push(filters.minCarat);
    paramIndex++;
  }

  if (filters.maxCarat) {
    whereConditions.push(`weight <= $${paramIndex}`);
    values.push(filters.maxCarat);
    paramIndex++;
  }

  // Range filters - Price
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

  // Range filters - Measurements
  if (filters.minLength) {
    whereConditions.push(`length >= $${paramIndex}`);
    values.push(filters.minLength);
    paramIndex++;
  }

  if (filters.maxLength) {
    whereConditions.push(`length <= $${paramIndex}`);
    values.push(filters.maxLength);
    paramIndex++;
  }

  if (filters.minWidth) {
    whereConditions.push(`width >= $${paramIndex}`);
    values.push(filters.minWidth);
    paramIndex++;
  }

  if (filters.maxWidth) {
    whereConditions.push(`width <= $${paramIndex}`);
    values.push(filters.maxWidth);
    paramIndex++;
  }

  if (filters.minHeight) {
    whereConditions.push(`height >= $${paramIndex}`);
    values.push(filters.minHeight);
    paramIndex++;
  }

  if (filters.maxHeight) {
    whereConditions.push(`height <= $${paramIndex}`);
    values.push(filters.maxHeight);
    paramIndex++;
  }

  if (filters.minRatio) {
    whereConditions.push(`CAST(lw_ratio AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minRatio);
    paramIndex++;
  }

  if (filters.maxRatio) {
    whereConditions.push(`CAST(lw_ratio AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxRatio);
    paramIndex++;
  }

  // Range filters - Percentages
  if (filters.minDepth) {
    whereConditions.push(`depth_percentage >= $${paramIndex}`);
    values.push(filters.minDepth);
    paramIndex++;
  }

  if (filters.maxDepth) {
    whereConditions.push(`depth_percentage <= $${paramIndex}`);
    values.push(filters.maxDepth);
    paramIndex++;
  }

  if (filters.minTable) {
    whereConditions.push(`table_percentage >= $${paramIndex}`);
    values.push(filters.minTable);
    paramIndex++;
  }

  if (filters.maxTable) {
    whereConditions.push(`table_percentage <= $${paramIndex}`);
    values.push(filters.maxTable);
    paramIndex++;
  }

  // Crown filters
  if (filters.minCrownHeight) {
    whereConditions.push(`CAST(crown_height AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minCrownHeight);
    paramIndex++;
  }

  if (filters.maxCrownHeight) {
    whereConditions.push(`CAST(crown_height AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxCrownHeight);
    paramIndex++;
  }

  if (filters.minCrownAngle) {
    whereConditions.push(`CAST(crown_angle AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minCrownAngle);
    paramIndex++;
  }

  if (filters.maxCrownAngle) {
    whereConditions.push(`CAST(crown_angle AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxCrownAngle);
    paramIndex++;
  }

  // Pavilion filters
  if (filters.minPavilionDepth) {
    whereConditions.push(`CAST(pavilion_depth AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minPavilionDepth);
    paramIndex++;
  }

  if (filters.maxPavilionDepth) {
    whereConditions.push(`CAST(pavilion_depth AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxPavilionDepth);
    paramIndex++;
  }

  if (filters.minPavilionAngle) {
    whereConditions.push(`CAST(pavilion_angle AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minPavilionAngle);
    paramIndex++;
  }

  if (filters.maxPavilionAngle) {
    whereConditions.push(`CAST(pavilion_angle AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxPavilionAngle);
    paramIndex++;
  }

  // Girdle filters
  if (filters.minGirdle) {
    whereConditions.push(`CAST(gridle_per AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minGirdle);
    paramIndex++;
  }

  if (filters.maxGirdle) {
    whereConditions.push(`CAST(gridle_per AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxGirdle);
    paramIndex++;
  }

  // Dropdown filters
  if (filters.milky) {
    whereConditions.push(`UPPER(milky) = UPPER($${paramIndex})`);
    values.push(filters.milky);
    paramIndex++;
  }

  if (filters.eyeClean) {
    whereConditions.push(`UPPER(eye_clean) = UPPER($${paramIndex})`);
    values.push(filters.eyeClean);
    paramIndex++;
  }

  if (filters.shade) {
    whereConditions.push(`UPPER(shade) = UPPER($${paramIndex})`);
    values.push(filters.shade);
    paramIndex++;
  }

  // Media filter
  if (filters.hasMedia) {
    whereConditions.push(
      `(diamond_image1 IS NOT NULL OR diamond_video IS NOT NULL)`,
    );
  }

  // Search
  if (filters.search) {
    whereConditions.push(`(
      shape ILIKE $${paramIndex} OR
      color ILIKE $${paramIndex} OR
      clarity ILIKE $${paramIndex} OR
      lab ILIKE $${paramIndex} OR
      stock_id ILIKE $${paramIndex}
    )`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  // Type filter (NATURAL/LAB_GROWN)
  if (filters.type) {
    whereConditions.push(`type = $${paramIndex}`);
    values.push(filters.type);
    paramIndex++;
  }

  // Certificate type filter (Certified vs Non-Certified)
  if (filters.certificateType === "certified") {
    whereConditions.push(
      `(lab IS NOT NULL AND TRIM(lab) <> '' AND UPPER(lab) <> 'NONE')`,
    );
  } else if (filters.certificateType === "non-certified") {
    whereConditions.push(
      `(lab IS NULL OR TRIM(lab) = '' OR UPPER(lab) = 'NONE')`,
    );
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  // Build filters using filter module
  // const {} = buildStockFilters(filters, 1);
  // const whereClause = buildWhereClause(whereConditions);
  // const { sortBy, sortOrder } = getSortConfig(filters);

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
    ORDER BY ${orderBy}
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

// Helper function to replace null/empty values with "None"
const normalizeNullValues = (data) => {
  if (!data) return null;

  const normalized = { ...data };

  for (const key in normalized) {
    const value = normalized[key];
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "null"
    ) {
      normalized[key] = "None";
    }
  }

  return normalized;
};

export const getById = async (id) => {
  const query = "SELECT * FROM diamond_stock WHERE id = $1";

  const result = await pool.query(query, [id]);

  return normalizeNullValues(result.rows[0]);
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

  // Normalize stockIds to uppercase for case-insensitive comparison
  const normalizedStockIds = stockIds.map((id) => id.toUpperCase());
  const placeholders = normalizedStockIds.map((_, i) => `$${i + 1}`).join(", ");
  const query = `DELETE FROM diamond_stock WHERE UPPER(stock_id) IN (${placeholders})`;

  const result = client
    ? await client.query(query, normalizedStockIds)
    : await pool.query(query, normalizedStockIds);

  return result.rowCount;
};

// Get stocks by user_id with filters and sorting
export const getByUserId = async (
  userId,
  page = 1,
  limit = 50,
  filters = {},
) => {
  const offset = (page - 1) * limit;

  // Build filters using filter module (startIndex=2 because $1 is user_id)
  const baseConditions = [`user_id = $1`];
  const baseValues = [userId];
  const { whereConditions, values, paramIndex } = buildStockFilters(
    filters,
    2,
    baseConditions,
  );

  // Combine base values with filter values
  const allValues = [...baseValues, ...values];

  const whereClause = buildWhereClause(whereConditions);
  const { orderClause } = getSortConfig(filters);

  // Count query
  const countQuery = `SELECT COUNT(*) FROM diamond_stock ${whereClause}`;
  const countResult = await pool.query(countQuery, allValues);
  const totalCount = parseInt(countResult.rows[0].count);

  // Data query - use paramIndex for correct LIMIT/OFFSET parameter placement
  const limitIndex = paramIndex;
  const offsetIndex = paramIndex + 1;
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
    ORDER BY ${orderClause}
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
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

  const [shapeResult, colorResult, fancyColorResult, clarityResult] =
    await Promise.all([
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

// Export pool query for raw queries
export const query = (text, params) => pool.query(text, params);

export { ALL_COLUMNS };

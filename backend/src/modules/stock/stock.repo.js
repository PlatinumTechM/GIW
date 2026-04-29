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
  "party",
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

    // Predefined shapes that are considered "standard" (not OTHER)
    const PREDEFINED_SHAPES = [
      "ROUND", "PEAR", "OVAL", "PRINCESS", "EMERALD", "CUSHION", "MARQUISE",
      "HEART", "RADIANT", "BAGUETTE", "HEXAGONAL", "SQUARE EMERALD", "BRIOLETTE",
      "TRILLIANT", "HALF MOON", "ROSE CUT", "KITE"
    ];

    // Check if "OTHER" is selected
    const hasOther = shapes.includes("OTHER");
    const specificShapes = shapes.filter(s => s !== "OTHER");

    if (hasOther) {
      if (specificShapes.length > 0) {
        // OTHER + specific shapes: show shapes not in predefined OR matching specific shapes
        const placeholders = PREDEFINED_SHAPES.map((_, i) => `$${paramIndex + i}`).join(", ");
        whereConditions.push(`(UPPER(ds.shape) NOT IN (${placeholders}) OR UPPER(ds.shape) IN (${specificShapes.map((_, i) => `$${paramIndex + PREDEFINED_SHAPES.length + i}`).join(", ")}))`);
        values.push(...PREDEFINED_SHAPES, ...specificShapes);
        paramIndex += PREDEFINED_SHAPES.length + specificShapes.length;
      } else {
        // Only OTHER selected: show shapes not in predefined list
        const placeholders = PREDEFINED_SHAPES.map((_, i) => `$${paramIndex + i}`).join(", ");
        whereConditions.push(`UPPER(ds.shape) NOT IN (${placeholders})`);
        values.push(...PREDEFINED_SHAPES);
        paramIndex += PREDEFINED_SHAPES.length;
      }
    } else {
      // Normal shape filtering - only specific shapes
      const placeholders = shapes.map((_, i) => `$${paramIndex + i}`).join(", ");
      whereConditions.push(`UPPER(ds.shape) IN (${placeholders})`);
      values.push(...shapes);
      paramIndex += shapes.length;
    }
  }

  if (filters.color) {
    const colors = filters.color.split(",").map((c) => c.trim().toUpperCase());
    const placeholders = colors.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.color) IN (${placeholders})`);
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
    whereConditions.push(`UPPER(ds.clarity) IN (${placeholders})`);
    values.push(...clarities);
    paramIndex += clarities.length;
  }

  if (filters.cut) {
    let cutsArray = filters.cut.split(",").map((c) => c.trim().toUpperCase());
    if (cutsArray.includes("3X")) {
      cutsArray = [...new Set([...cutsArray.filter(c => c !== "3X"), "IDEAL", "EXCELLENT"])];
    }
    if (cutsArray.includes("3VG")) {
      cutsArray = [...new Set([...cutsArray.filter(c => c !== "3VG"), "IDEAL", "EXCELLENT", "VERY GOOD"])];
    }
    const cuts = cutsArray.map((c) => mapFilterValue(c).toUpperCase());
    const placeholders = cuts.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.cut) IN (${placeholders})`);
    values.push(...cuts);
    paramIndex += cuts.length;
  }

  if (filters.polish) {
    let polishesArray = filters.polish.split(",").map((p) => p.trim().toUpperCase());
    if (polishesArray.includes("3X")) {
      polishesArray = [...new Set([...polishesArray.filter(p => p !== "3X"), "IDEAL", "EXCELLENT"])];
    }
    if (polishesArray.includes("3VG")) {
      polishesArray = [...new Set([...polishesArray.filter(p => p !== "3VG"), "IDEAL", "EXCELLENT", "VERY GOOD"])];
    }
    const polishes = polishesArray.map((p) => mapFilterValue(p).toUpperCase());
    const placeholders = polishes
      .map((_, i) => `$${paramIndex + i}`)
      .join(", ");
    whereConditions.push(`UPPER(ds.polish) IN (${placeholders})`);
    values.push(...polishes);
    paramIndex += polishes.length;
  }

  if (filters.symmetry) {
    let symmetriesArray = filters.symmetry.split(",").map((s) => s.trim().toUpperCase());
    if (symmetriesArray.includes("3X")) {
      symmetriesArray = [...new Set([...symmetriesArray.filter(s => s !== "3X"), "IDEAL", "EXCELLENT"])];
    }
    if (symmetriesArray.includes("3VG")) {
      symmetriesArray = [...new Set([...symmetriesArray.filter(s => s !== "3VG"), "IDEAL", "EXCELLENT", "VERY GOOD"])];
    }
    const symmetries = symmetriesArray.map((s) => mapFilterValue(s).toUpperCase());
    const placeholders = symmetries
      .map((_, i) => `$${paramIndex + i}`)
      .join(", ");
    whereConditions.push(`UPPER(ds.symmetry) IN (${placeholders})`);
    values.push(...symmetries);
    paramIndex += symmetries.length;
  }

  if (filters.fluorescence) {
    const flours = filters.fluorescence
      .split(",")
      .map((f) => f.trim().toUpperCase());
    const placeholders = flours.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.fluorescence) IN (${placeholders})`);
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
      whereConditions.push(`ds.fancy_color ILIKE $${paramIndex}`);
      values.push(`%${fancyColors[0]}%`);
      paramIndex++;
    } else {
      const placeholders = fancyColors
        .map((_, i) => `$${paramIndex + i}`)
        .join(", ");
      whereConditions.push(`ds.fancy_color ILIKE ANY(ARRAY[${placeholders}])`);
      values.push(...fancyColors.map((c) => `%${c}%`));
      paramIndex += fancyColors.length;
    }
  }

  if (filters.fancyIntensity) {
    const intensities = filters.fancyIntensity
      .split(",")
      .map((i) => i.trim().toUpperCase());
    if (intensities.length === 1) {
      whereConditions.push(`UPPER(ds.fancy_color_intensity) = $${paramIndex}`);
      values.push(intensities[0]);
      paramIndex++;
    } else {
      const placeholders = intensities
        .map((_, i) => `$${paramIndex + i}`)
        .join(", ");
      whereConditions.push(`UPPER(ds.fancy_color_intensity) IN (${placeholders})`);
      values.push(...intensities);
      paramIndex += intensities.length;
    }
  }

  if (filters.fancyOvertone) {
    const overtones = filters.fancyOvertone
      .split(",")
      .map((o) => o.trim().toUpperCase());
    if (overtones.length === 1) {
      whereConditions.push(`UPPER(ds.fancy_color_overtone) = $${paramIndex}`);
      values.push(overtones[0]);
      paramIndex++;
    } else {
      const placeholders = overtones
        .map((_, i) => `$${paramIndex + i}`)
        .join(", ");
      whereConditions.push(`UPPER(ds.fancy_color_overtone) IN (${placeholders})`);
      values.push(...overtones);
      paramIndex += overtones.length;
    }
  }

  // Status/Availability
  if (filters.status) {
    whereConditions.push(`ds.status = $${paramIndex}`);
    values.push(filters.status);
    paramIndex++;
  }

  if (filters.availability) {
    whereConditions.push(`ds.status = $${paramIndex}`);
    values.push(filters.availability);
    paramIndex++;
  }

  // Range filters - Carat (weight)
  if (filters.minCarat) {
    whereConditions.push(`ds.weight >= $${paramIndex}`);
    values.push(filters.minCarat);
    paramIndex++;
  }

  if (filters.maxCarat) {
    whereConditions.push(`ds.weight <= $${paramIndex}`);
    values.push(filters.maxCarat);
    paramIndex++;
  }

  // Range filters - Price
  if (filters.minPrice) {
    whereConditions.push(`ds.final_price >= $${paramIndex}`);
    values.push(filters.minPrice);
    paramIndex++;
  }

  if (filters.maxPrice) {
    whereConditions.push(`ds.final_price <= $${paramIndex}`);
    values.push(filters.maxPrice);
    paramIndex++;
  }

  // Range filters - Measurements
  if (filters.minLength) {
    whereConditions.push(`ds.length >= $${paramIndex}`);
    values.push(filters.minLength);
    paramIndex++;
  }

  if (filters.maxLength) {
    whereConditions.push(`ds.length <= $${paramIndex}`);
    values.push(filters.maxLength);
    paramIndex++;
  }

  if (filters.minWidth) {
    whereConditions.push(`ds.width >= $${paramIndex}`);
    values.push(filters.minWidth);
    paramIndex++;
  }

  if (filters.maxWidth) {
    whereConditions.push(`ds.width <= $${paramIndex}`);
    values.push(filters.maxWidth);
    paramIndex++;
  }

  if (filters.minHeight) {
    whereConditions.push(`ds.height >= $${paramIndex}`);
    values.push(filters.minHeight);
    paramIndex++;
  }

  if (filters.maxHeight) {
    whereConditions.push(`ds.height <= $${paramIndex}`);
    values.push(filters.maxHeight);
    paramIndex++;
  }

  if (filters.minRatio) {
    whereConditions.push(`CAST(ds.lw_ratio AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minRatio);
    paramIndex++;
  }

  if (filters.maxRatio) {
    whereConditions.push(`CAST(ds.lw_ratio AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxRatio);
    paramIndex++;
  }

  // Range filters - Percentages
  if (filters.minDepth) {
    whereConditions.push(`ds.depth_percentage >= $${paramIndex}`);
    values.push(filters.minDepth);
    paramIndex++;
  }

  if (filters.maxDepth) {
    whereConditions.push(`ds.depth_percentage <= $${paramIndex}`);
    values.push(filters.maxDepth);
    paramIndex++;
  }

  if (filters.minTable) {
    whereConditions.push(`ds.table_percentage >= $${paramIndex}`);
    values.push(filters.minTable);
    paramIndex++;
  }

  if (filters.maxTable) {
    whereConditions.push(`ds.table_percentage <= $${paramIndex}`);
    values.push(filters.maxTable);
    paramIndex++;
  }

  // Crown filters
  if (filters.minCrownHeight) {
    whereConditions.push(`CAST(ds.crown_height AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minCrownHeight);
    paramIndex++;
  }

  if (filters.maxCrownHeight) {
    whereConditions.push(`CAST(ds.crown_height AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxCrownHeight);
    paramIndex++;
  }

  if (filters.minCrownAngle) {
    whereConditions.push(`CAST(ds.crown_angle AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minCrownAngle);
    paramIndex++;
  }

  if (filters.maxCrownAngle) {
    whereConditions.push(`CAST(ds.crown_angle AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxCrownAngle);
    paramIndex++;
  }

  // Pavilion filters
  if (filters.minPavilionDepth) {
    whereConditions.push(`CAST(ds.pavilion_depth AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minPavilionDepth);
    paramIndex++;
  }

  if (filters.maxPavilionDepth) {
    whereConditions.push(`CAST(ds.pavilion_depth AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxPavilionDepth);
    paramIndex++;
  }

  if (filters.minPavilionAngle) {
    whereConditions.push(`CAST(ds.pavilion_angle AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minPavilionAngle);
    paramIndex++;
  }

  if (filters.maxPavilionAngle) {
    whereConditions.push(`CAST(ds.pavilion_angle AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxPavilionAngle);
    paramIndex++;
  }

  // Girdle filters
  if (filters.minGirdle) {
    whereConditions.push(`CAST(ds.gridle_per AS DECIMAL) >= $${paramIndex}`);
    values.push(filters.minGirdle);
    paramIndex++;
  }

  if (filters.maxGirdle) {
    whereConditions.push(`CAST(ds.gridle_per AS DECIMAL) <= $${paramIndex}`);
    values.push(filters.maxGirdle);
    paramIndex++;
  }

  // Dropdown filters
  if (filters.milky) {
    whereConditions.push(`UPPER(ds.milky) = UPPER($${paramIndex})`);
    values.push(filters.milky);
    paramIndex++;
  }

  if (filters.eyeClean) {
    whereConditions.push(`UPPER(ds.eye_clean) = UPPER($${paramIndex})`);
    values.push(filters.eyeClean);
    paramIndex++;
  }

  if (filters.shade) {
    whereConditions.push(`UPPER(ds.shade) = UPPER($${paramIndex})`);
    values.push(filters.shade);
    paramIndex++;
  }

  // Media filter
  if (filters.hasMedia) {
    whereConditions.push(
      `(ds.diamond_image1 IS NOT NULL OR ds.diamond_video IS NOT NULL)`,
    );
  }

  // Search
  if (filters.search) {
    whereConditions.push(`(
      ds.shape ILIKE $${paramIndex} OR
      ds.color ILIKE $${paramIndex} OR
      ds.clarity ILIKE $${paramIndex} OR
      ds.lab ILIKE $${paramIndex} OR
      ds.stock_id ILIKE $${paramIndex}
    )`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  // Type filter (NATURAL/LAB_GROWN)
  if (filters.type) {
    whereConditions.push(`ds.type = $${paramIndex}`);
    values.push(filters.type);
    paramIndex++;
  }

  // Certificate type filter (Certified vs Non-Certified)
  if (filters.certificateType === "certified") {
    whereConditions.push(
      `(ds.lab IS NOT NULL AND TRIM(ds.lab) <> '' AND UPPER(ds.lab) <> 'NONE')`,
    );
  } else if (filters.certificateType === "non-certified") {
    whereConditions.push(
      `(ds.lab IS NULL OR TRIM(ds.lab) = '' OR UPPER(ds.lab) = 'NONE')`,
    );
  }

  // Lab filter - handles both specific lab names and "Non certified"
  if (filters.lab) {
    if (filters.lab === "Non certified") {
      whereConditions.push(`(ds.certificate_number IS NULL OR TRIM(ds.certificate_number) = '' OR ds.certificate_number = 'NONE')`);
    } else {
      whereConditions.push(`UPPER(ds.lab) = UPPER($${paramIndex})`);
      values.push(filters.lab);
      paramIndex++;
    }
  }

  if (filters.growthType) {
    const types = filters.growthType.split(",").map((t) => t.trim().toUpperCase());
    const placeholders = types.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.growth_type) IN (${placeholders})`);
    values.push(...types);
    paramIndex += types.length;
  }

  if (filters.treatment) {
    const treatments = filters.treatment.split(",").map((t) => t.trim().toUpperCase());
    const placeholders = treatments.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.treatment) IN (${placeholders})`);
    values.push(...treatments);
    paramIndex += treatments.length;
  }

  if (filters.heartArrow === true || filters.heartArrow === "true") {
    whereConditions.push(`ds.heart_arrow = true`);
  }

  if (filters.noBgm === true || filters.noBgm === "true") {
    whereConditions.push(`ds.no_bgm = true`);
  }

  // Location filter (city, state, country)
  if (filters.location) {
    whereConditions.push(`(
      ds.city ILIKE $${paramIndex} OR
      ds.state ILIKE $${paramIndex} OR
      ds.country ILIKE $${paramIndex}
    )`);
    values.push(`%${filters.location}%`);
    paramIndex++;
  }

  // Supplier filter (company name from users table)
  if (filters.supplier) {
    whereConditions.push(`(
      u.company ILIKE $${paramIndex} AND u.role ILIKE 'Seller'
    )`);
    values.push(`%${filters.supplier}%`);
    paramIndex++;
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  // Count query
  const countQuery = `
    SELECT COUNT(*) 
    FROM diamond_stock ds
    LEFT JOIN users u ON ds.user_id = u.id
    ${whereClause}
  `;
  const countResult = await pool.query(countQuery, values);
  const totalCount = parseInt(countResult.rows[0].count);

  // Data query
  const dataQuery = `
    SELECT
      ds.id, ds.type, ds.user_id, ds.stock_id, ds.certificate_number, ds.weight, ds.shape, ds.color,
      ds.fancy_color, ds.fancy_color_intensity, ds.fancy_color_overtone, ds.clarity, ds.cut, ds.polish,
      ds.symmetry, ds.fluorescence, ds.fluorescence_color, ds.fluorescence_intensity, ds.measurements,
      ds.length, ds.width, ds.height, ds.shade, ds.milky, ds.eye_clean, ds.lab, ds.certificate_comment, ds.city,
      ds.state, ds.country, ds.treatment, ds.depth_percentage, ds.table_percentage, ds.rap_price,
      ds.rap_per_carat, ds.price_per_carat, ds.final_price, ds.discount, ds.heart_arrow, ds.star_length,
      ds.laser_description, ds.growth_type, ds.key_to_symbol, ds.lw_ratio, ds.culet_size, ds.culet_condition,
      ds.gridle_thin, ds.gridle_thick, ds.gridle_condition, ds.gridle_per, ds.crown_height, ds.crown_angle,
      ds.pavilion_depth, ds.pavilion_angle, ds.status, ds.diamond_image1, ds.diamond_video, ds.certificate_image,
      u.company as supplier_name
    FROM diamond_stock ds
    LEFT JOIN users u ON ds.user_id = u.id
    ${whereClause}
    ORDER BY ${orderBy.replace(/\b(created_at|final_price|weight|color)\b/g, 'ds.$1')}
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

export const toggleHold = async (id, userId) => {
  const checkQuery = "SELECT status FROM diamond_stock WHERE id = $1 AND user_id = $2";
  const checkResult = await pool.query(checkQuery, [id, userId]);

  if (checkResult.rows.length === 0) return null;

  const currentStatus = checkResult.rows[0].status;
  const newStatus = currentStatus === 'HOLD' ? 'AVAILABLE' : 'HOLD';

  const updateQuery = "UPDATE diamond_stock SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *";
  const result = await pool.query(updateQuery, [newStatus, id, userId]);

  return result.rows[0];
};

export const sellStock = async (id, userId, ip) => {
  const selectQuery = "SELECT * FROM diamond_stock WHERE id = $1 AND user_id = $2";
  const selectResult = await pool.query(selectQuery, [id, userId]);

  if (selectResult.rows.length === 0) return null;

  const stockData = selectResult.rows[0];

  // Start transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert into sell_data
    const insertQuery = "INSERT INTO sell_data (user_id, metadata, ip) VALUES ($1, $2, $3) RETURNING *";
    await client.query(insertQuery, [userId, JSON.stringify(stockData), ip]);

    // Delete from diamond_stock
    const deleteQuery = "DELETE FROM diamond_stock WHERE id = $1 AND user_id = $2";
    await client.query(deleteQuery, [id, userId]);

    await client.query('COMMIT');
    return stockData;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const bulkToggleHold = async (ids, userId) => {
  if (!ids || ids.length === 0) return [];

  // This is a bulk toggle. For simplicity, we toggle all selected IDs.
  // Note: If you want to ensure all become 'HOLD' or all become 'AVAILABLE', 
  // you might want to pass the target status.
  const query = `
    UPDATE diamond_stock 
    SET status = CASE WHEN status = 'HOLD' THEN 'AVAILABLE' ELSE 'HOLD' END,
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = ANY($1::int[]) AND user_id = $2 
    RETURNING *
  `;
  const result = await pool.query(query, [ids, userId]);
  return result.rows;
};

export const bulkSellStock = async (ids, userId, ip) => {
  if (!ids || ids.length === 0) return 0;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch all stocks to move to history
    const selectQuery = "SELECT * FROM diamond_stock WHERE id = ANY($1::int[]) AND user_id = $2";
    const selectResult = await client.query(selectQuery, [ids, userId]);

    if (selectResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return 0;
    }

    // Bulk insert into sell_data
    // We insert each record's metadata
    for (const stock of selectResult.rows) {
      const insertQuery = "INSERT INTO sell_data (user_id, metadata, ip) VALUES ($1, $2, $3)";
      await client.query(insertQuery, [userId, JSON.stringify(stock), ip]);
    }

    // Bulk delete from diamond_stock
    const deleteQuery = "DELETE FROM diamond_stock WHERE id = ANY($1::int[]) AND user_id = $2";
    const deleteResult = await client.query(deleteQuery, [ids, userId]);

    await client.query('COMMIT');
    return deleteResult.rowCount;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Delete stocks by stock_id array (for bulk replace)

export const deleteByStockIds = async (stockIds, userId, client = null) => {
  if (stockIds.length === 0) return 0;

  // Normalize stockIds to uppercase for case-insensitive comparison
  const normalizedStockIds = stockIds.map((id) => id.toUpperCase());
  const query = `DELETE FROM diamond_stock WHERE UPPER(stock_id) = ANY($1::text[]) AND user_id = $2`;

  const result = client
    ? await client.query(query, [normalizedStockIds, userId])
    : await pool.query(query, [normalizedStockIds, userId]);

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
  const whereConditions = [`ds.user_id = $1`];
  const values = [userId];
  let paramIndex = 2;

  // Manual filters for getByUserId
  if (filters.stockId) {
    whereConditions.push(`ds.stock_id ILIKE $${paramIndex}`);
    values.push(`%${filters.stockId}%`);
    paramIndex++;
  }

  if (filters.certificate) {
    whereConditions.push(`ds.certificate_number ILIKE $${paramIndex}`);
    values.push(`%${filters.certificate}%`);
    paramIndex++;
  }

  if (filters.status) {
    whereConditions.push(`ds.status = $${paramIndex}`);
    values.push(filters.status);
    paramIndex++;
  }

  if (filters.shape) {
    const shapes = filters.shape.split(",").map((s) => s.trim().toUpperCase());
    const placeholders = shapes.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.shape) IN (${placeholders})`);
    values.push(...shapes);
    paramIndex += shapes.length;
  }

  if (filters.color) {
    const colors = filters.color.split(",").map((c) => c.trim().toUpperCase());
    const placeholders = colors.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.color) IN (${placeholders})`);
    values.push(...colors);
    paramIndex += colors.length;
  }

  if (filters.clarity) {
    const clarities = filters.clarity.split(",").map((c) => c.trim().toUpperCase());
    const placeholders = clarities.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.clarity) IN (${placeholders})`);
    values.push(...clarities);
    paramIndex += clarities.length;
  }

  if (filters.cut) {
    let cutsArray = filters.cut.split(",").map((c) => c.trim().toUpperCase());
    if (cutsArray.includes("3X")) {
      cutsArray = [...new Set([...cutsArray.filter(c => c !== "3X"), "IDEAL", "EXCELLENT"])];
    }
    if (cutsArray.includes("3VG")) {
      cutsArray = [...new Set([...cutsArray.filter(c => c !== "3VG"), "IDEAL", "EXCELLENT", "VERY GOOD"])];
    }
    const cuts = cutsArray.map((c) => mapFilterValue(c).toUpperCase());
    const placeholders = cuts.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.cut) IN (${placeholders})`);
    values.push(...cuts);
    paramIndex += cuts.length;
  }

  if (filters.polish) {
    let polishesArray = filters.polish.split(",").map((p) => p.trim().toUpperCase());
    if (polishesArray.includes("3X")) {
      polishesArray = [...new Set([...polishesArray.filter(p => p !== "3X"), "IDEAL", "EXCELLENT"])];
    }
    if (polishesArray.includes("3VG")) {
      polishesArray = [...new Set([...polishesArray.filter(p => p !== "3VG"), "IDEAL", "EXCELLENT", "VERY GOOD"])];
    }
    const polishes = polishesArray.map((p) => mapFilterValue(p).toUpperCase());
    const placeholders = polishes.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.polish) IN (${placeholders})`);
    values.push(...polishes);
    paramIndex += polishes.length;
  }

  if (filters.symmetry) {
    let symmetriesArray = filters.symmetry.split(",").map((s) => s.trim().toUpperCase());
    if (symmetriesArray.includes("3X")) {
      symmetriesArray = [...new Set([...symmetriesArray.filter(s => s !== "3X"), "IDEAL", "EXCELLENT"])];
    }
    if (symmetriesArray.includes("3VG")) {
      symmetriesArray = [...new Set([...symmetriesArray.filter(s => s !== "3VG"), "IDEAL", "EXCELLENT", "VERY GOOD"])];
    }
    const symmetries = symmetriesArray.map((s) => mapFilterValue(s).toUpperCase());
    const placeholders = symmetries.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.symmetry) IN (${placeholders})`);
    values.push(...symmetries);
    paramIndex += symmetries.length;
  }

  if (filters.fluorescence) {
    const flours = filters.fluorescence.split(",").map((f) => f.trim().toUpperCase());
    const placeholders = flours.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.fluorescence) IN (${placeholders})`);
    values.push(...flours);
    paramIndex += flours.length;
  }

  if (filters.lab) {
    const labs = filters.lab.split(",").map((l) => l.trim().toUpperCase());
    const placeholders = labs.map((_, i) => `$${paramIndex + i}`).join(", ");
    whereConditions.push(`UPPER(ds.lab) IN (${placeholders})`);
    values.push(...labs);
    paramIndex += labs.length;
  }

  if (filters.minWeight) {
    whereConditions.push(`ds.weight >= $${paramIndex}`);
    values.push(filters.minWeight);
    paramIndex++;
  }

  if (filters.maxWeight) {
    whereConditions.push(`ds.weight <= $${paramIndex}`);
    values.push(filters.maxWeight);
    paramIndex++;
  }

  if (filters.party) {
    whereConditions.push(`ds.party = $${paramIndex}`);
    values.push(filters.party);
    paramIndex++;
  }

  if (filters.search) {
    whereConditions.push(`(ds.stock_id ILIKE $${paramIndex} OR ds.certificate_number ILIKE $${paramIndex} OR ds.shape ILIKE $${paramIndex} OR ds.party ILIKE $${paramIndex})`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  const whereClause = `WHERE ${whereConditions.join(" AND ")}`;
  const orderClause = "ds.created_at DESC, ds.id DESC";

  // Count query
  const countQuery = `SELECT COUNT(*) FROM diamond_stock ds ${whereClause}`;
  const countResult = await pool.query(countQuery, values);
  const totalCount = parseInt(countResult.rows[0].count);

  // Finalize data query with explicit LIMIT and OFFSET
  const finalLimit = parseInt(limit) || 50;
  const finalOffset = parseInt(offset) || 0;

  const dataQuery = `
    SELECT
      ds.id, ds.type, ds.user_id, ds.stock_id, ds.certificate_number, ds.weight, ds.shape, ds.color,
      ds.fancy_color, ds.fancy_color_intensity, ds.fancy_color_overtone, ds.clarity, ds.cut, ds.polish,
      ds.symmetry, ds.fluorescence, ds.fluorescence_color, ds.fluorescence_intensity, ds.measurements,
      ds.length, ds.width, ds.height, ds.shade, ds.milky, ds.eye_clean, ds.lab, ds.certificate_comment, ds.city,
      ds.state, ds.country, ds.treatment, ds.depth_percentage, ds.table_percentage, ds.rap_price,
      ds.rap_per_carat, ds.price_per_carat, ds.final_price, ds.discount, ds.heart_arrow, ds.star_length,
      ds.laser_description, ds.growth_type, ds.key_to_symbol, ds.lw_ratio, ds.culet_size, ds.culet_condition,
      ds.gridle_thin, ds.gridle_thick, ds.gridle_condition, ds.gridle_per, ds.crown_height, ds.crown_angle, ds.party,
      ds.pavilion_depth, ds.pavilion_angle, ds.status, ds.diamond_image1, ds.diamond_video, ds.certificate_image
    FROM diamond_stock ds
    ${whereClause}
    ORDER BY ${orderClause}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const dataValues = [...values, finalLimit, finalOffset];
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

export const getFilterOptions = async (userId = null) => {
  const where = (field) => {
    let base = `WHERE ${field} IS NOT NULL AND ${field} != ''`;
    if (userId) base += ` AND user_id = $1`;
    return base;
  };

  const shapeQuery = `SELECT DISTINCT UPPER(shape) as value FROM diamond_stock ${where('shape')} ORDER BY value`;
  const colorQuery = `SELECT DISTINCT UPPER(color) as value FROM diamond_stock ${where('color')} ORDER BY value`;
  const fancyColorQuery = `SELECT DISTINCT UPPER(fancy_color) as value FROM diamond_stock ${where('fancy_color')} ORDER BY value`;
  const clarityQuery = `SELECT DISTINCT UPPER(clarity) as value FROM diamond_stock ${where('clarity')} ORDER BY value`;
  const labQuery = `SELECT DISTINCT UPPER(lab) as value FROM diamond_stock ${where('lab')} ORDER BY value`;
  const partyQuery = `SELECT DISTINCT party as value FROM diamond_stock ${where('party')} ORDER BY value`;

  const params = userId ? [userId] : [];

  const [shapeResult, colorResult, fancyColorResult, clarityResult, labResult, partyResult] =
    await Promise.all([
      pool.query(shapeQuery, params),
      pool.query(colorQuery, params),
      pool.query(fancyColorQuery ? fancyColorQuery : "SELECT 1", params), // handle missing fancyColor if needed, but it's defined
      pool.query(clarityQuery, params),
      pool.query(labQuery, params),
      pool.query(partyQuery, params),
    ]);

  // Combine colors and fancy colors, remove duplicates
  const dbColors = colorResult.rows.map((r) => r.value);
  const dbFancyColors = fancyColorResult.rows.map((r) => r.value);
  const allColors = [...new Set([...dbColors, ...dbFancyColors])];

  // Add lab options - include "Non certified" for null certificate values
  const labOptions = labResult.rows.map((r) => r.value);
  labOptions.unshift("Non certified"); // Add at the beginning

  const supplierQuery = `SELECT DISTINCT company as value FROM users WHERE role ILIKE 'seller' AND company IS NOT NULL AND company != '' ORDER BY value`;
  const supplierResult = await pool.query(supplierQuery);

  return {
    shapes: shapeResult.rows.map((r) => r.value),
    colors: allColors,
    clarities: clarityResult.rows.map((r) => r.value),
    labs: labOptions,
    parties: partyResult.rows.map((r) => r.value),
    suppliers: supplierResult.rows.map((r) => r.value),
  };
};

// Export pool query for raw queries
export const query = (text, params) => pool.query(text, params);

export { ALL_COLUMNS };

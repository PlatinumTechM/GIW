import { pool } from "../../../config/db.js";

const ALL_COLUMNS = [
  "type",
  "user_id",
  "stock_id",
  "category",
  "name",
  "description",
  "material",
  "weight",
  "diamond_type",
  "diamond_shape",
  "diamond_weight",
  "total_diamond_weight",
  "diamond_color",
  "diamond_clarity",
  "diamond_cut",
  "diamond_growth",
  "price",
  "status",
  "jewellery_image1",
  "jewellery_image2",
  "jewellery_image3",
  "jewellery_image4",
  "jewellery_image5",
  "jewellery_video"
];

export const getAll = async (page = 1, limit = 50, sortBy = "created_at DESC", filters = {}) => {
  const offset = (page - 1) * limit;
  const whereConditions = [];
  const values = [];
  let paramIndex = 1;

  if (filters.userId) {
    whereConditions.push(`user_id = $${paramIndex}`);
    values.push(filters.userId);
    paramIndex++;
  }

  if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
    // Handle OTHER category - items not in listed categories
    if (filters.categories.includes("OTHER")) {
      const listedCategories = filters.categories.filter(c => c !== "OTHER");
      if (listedCategories.length > 0) {
        // OTHER: items not in the listed categories
        whereConditions.push(`(category IS NULL OR category NOT IN (${listedCategories.map((_, i) => `$${paramIndex + i}`).join(",")}))`);
        values.push(...listedCategories);
        paramIndex += listedCategories.length;
      } else {
        // If only OTHER is selected, show items with null or empty category
        whereConditions.push(`(category IS NULL OR category = '' OR category NOT IN ('RING', 'NECKLACE', 'EARRINGS', 'BRACELET', 'PENDANT', 'BANGLE', 'BROOCH'))`);
      }
    } else {
      // Normal category filtering
      whereConditions.push(`category = ANY($${paramIndex})`);
      values.push(filters.categories);
      paramIndex++;
    }
  }

  if (filters.materials && Array.isArray(filters.materials) && filters.materials.length > 0) {
    // Handle OTHER material - items not in listed predefined materials
    const predefinedMaterials = ["WHITE GOLD", "YELLOW GOLD", "ROSE GOLD", "PLATINUM", "SILVER", "TWO TONE"];
    
    if (filters.materials.includes("other")) {
      const listedMaterials = filters.materials.map(m => m.toUpperCase()).filter(m => m !== "OTHER");
      if (listedMaterials.length > 0) {
        // OTHER + specific materials: items not in predefined OR matching specific materials
        whereConditions.push(`(material IS NULL OR material NOT IN (${predefinedMaterials.map((_, i) => `$${paramIndex + i}`).join(",")}) OR UPPER(material) = ANY($${paramIndex + predefinedMaterials.length}))`);
        values.push(...predefinedMaterials, listedMaterials);
        paramIndex += predefinedMaterials.length + 1;
      } else {
        // If only OTHER is selected, show items with materials not in predefined list
        whereConditions.push(`(material IS NULL OR material NOT IN (${predefinedMaterials.map((_, i) => `$${paramIndex + i}`).join(",")}))`);
        values.push(...predefinedMaterials);
        paramIndex += predefinedMaterials.length;
      }
    } else {
      // Normal material filtering
      whereConditions.push(`UPPER(material) = ANY($${paramIndex})`);
      values.push(filters.materials.map(m => m.toUpperCase()));
      paramIndex++;
    }
  }

  if (filters.shapes && Array.isArray(filters.shapes) && filters.shapes.length > 0) {
    // Handle OTHER shape - items not in listed predefined shapes
    const predefinedShapes = ["ROUND", "PEAR", "OVAL", "PRINCESS", "EMERALD", "CUSHION", "MARQUISE", "HEART", "RADIANT", "BAGUETTE", "HEXAGONAL", "SQUARE EMERALD", "BRIOLETTE", "TRILLIANT", "HALF MOON", "ROSE CUT", "KITE"];
    
    if (filters.shapes.includes("other")) {
      const listedShapes = filters.shapes.filter(s => s !== "other");
      if (listedShapes.length > 0) {
        // OTHER + specific shapes: items not in predefined OR matching specific shapes
        whereConditions.push(`(diamond_shape IS NULL OR diamond_shape NOT IN (${predefinedShapes.map((_, i) => `$${paramIndex + i}`).join(",")}) OR diamond_shape = ANY($${paramIndex + predefinedShapes.length}))`);
        values.push(...predefinedShapes, listedShapes);
        paramIndex += predefinedShapes.length + 1;
      } else {
        // If only OTHER is selected, show items with shapes not in predefined list
        whereConditions.push(`(diamond_shape IS NULL OR diamond_shape NOT IN (${predefinedShapes.map((_, i) => `$${paramIndex + i}`).join(",")}))`);
        values.push(...predefinedShapes);
        paramIndex += predefinedShapes.length;
      }
    } else {
      // Normal shape filtering
      whereConditions.push(`diamond_shape = ANY($${paramIndex})`);
      values.push(filters.shapes);
      paramIndex++;
    }
  }

  if (filters.colors && Array.isArray(filters.colors) && filters.colors.length > 0) {
    whereConditions.push(`diamond_color = ANY($${paramIndex})`);
    values.push(filters.colors);
    paramIndex++;
  }

  if (filters.clarities && Array.isArray(filters.clarities) && filters.clarities.length > 0) {
    whereConditions.push(`diamond_clarity = ANY($${paramIndex})`);
    values.push(filters.clarities);
    paramIndex++;
  }

  if (filters.status) {
    whereConditions.push(`LOWER(status) = LOWER($${paramIndex})`);
    values.push(filters.status);
    paramIndex++;
  }

  if (filters.typeFilter === "natural") {
    whereConditions.push(`(diamond_type IS NULL OR LOWER(diamond_type) NOT LIKE '%lab%')`);
  } else if (filters.typeFilter === "lab-grown") {
    whereConditions.push(`(LOWER(diamond_type) LIKE '%lab%' OR LOWER(diamond_type) LIKE '%cvd%' OR LOWER(diamond_type) LIKE '%hpht%')`);
  }

  if (filters.diamond_type) {
    whereConditions.push(`LOWER(diamond_type) = LOWER($${paramIndex})`);
    values.push(filters.diamond_type);
    paramIndex++;
  }

  if (filters.weight && filters.weight !== "") {
    whereConditions.push(`weight >= $${paramIndex}`);
    values.push(parseFloat(filters.weight));
    paramIndex++;
  }

  if (filters.diamond_weight && filters.diamond_weight !== "") {
    whereConditions.push(`diamond_weight >= $${paramIndex}`);
    values.push(parseFloat(filters.diamond_weight));
    paramIndex++;
  }

  if (filters.totalWeightFrom && filters.totalWeightFrom !== "") {
    whereConditions.push(`total_diamond_weight >= $${paramIndex}`);
    values.push(parseFloat(filters.totalWeightFrom));
    paramIndex++;
  }

  if (filters.totalWeightTo && filters.totalWeightTo !== "") {
    whereConditions.push(`total_diamond_weight <= $${paramIndex}`);
    values.push(parseFloat(filters.totalWeightTo));
    paramIndex++;
  }

  if (filters.priceFrom && filters.priceFrom !== "") {
    whereConditions.push(`price >= $${paramIndex}`);
    values.push(parseFloat(filters.priceFrom));
    paramIndex++;
  }

  if (filters.priceTo && filters.priceTo !== "") {
    whereConditions.push(`price <= $${paramIndex}`);
    values.push(parseFloat(filters.priceTo));
    paramIndex++;
  }

  if (filters.search || filters.stock_id) {
    const searchVal = filters.search || filters.stock_id;
    whereConditions.push(`(name ILIKE $${paramIndex} OR stock_id ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
    values.push(`%${searchVal}%`);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  
  const countQuery = `SELECT COUNT(*) FROM jewellery_stock ${whereClause}`;
  const countResult = await pool.query(countQuery, values);
  const totalCount = parseInt(countResult.rows[0].count);

  const dataQuery = `
    SELECT * FROM jewellery_stock
    ${whereClause}
    ORDER BY ${sortBy}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

  return {
    items: dataResult.rows,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getById = async (id) => {
  const query = "SELECT * FROM jewellery_stock WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const create = async (data) => {
  const columns = Object.keys(data).filter(col => ALL_COLUMNS.includes(col));
  const values = columns.map(col => data[col]);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO jewellery_stock (${columns.join(", ")})
    VALUES (${placeholders})
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const update = async (id, data) => {
  const columns = Object.keys(data).filter(col => ALL_COLUMNS.includes(col));
  const values = columns.map(col => data[col]);
  
  if (columns.length === 0) return null;

  const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");
  const query = `
    UPDATE jewellery_stock
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${values.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

export const deleteById = async (id) => {
  const query = "DELETE FROM jewellery_stock WHERE id = $1 RETURNING *";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const getFilterOptions = async (userId) => {
  const categoryQuery = `SELECT DISTINCT category FROM jewellery_stock WHERE user_id = $1 AND category IS NOT NULL ORDER BY category`;
  const materialQuery = `SELECT DISTINCT material FROM jewellery_stock WHERE user_id = $1 AND material IS NOT NULL ORDER BY material`;
  const statusQuery = `SELECT DISTINCT status FROM jewellery_stock WHERE user_id = $1 AND status IS NOT NULL ORDER BY status`;
  const shapeQuery = `SELECT DISTINCT diamond_shape FROM jewellery_stock WHERE user_id = $1 AND diamond_shape IS NOT NULL ORDER BY diamond_shape`;
  const colorQuery = `SELECT DISTINCT diamond_color FROM jewellery_stock WHERE user_id = $1 AND diamond_color IS NOT NULL ORDER BY diamond_color`;
  const clarityQuery = `SELECT DISTINCT diamond_clarity FROM jewellery_stock WHERE user_id = $1 AND diamond_clarity IS NOT NULL ORDER BY diamond_clarity`;

  const [categories, materials, statuses, shapes, colors, clarities] = await Promise.all([
    pool.query(categoryQuery, [userId]),
    pool.query(materialQuery, [userId]),
    pool.query(statusQuery, [userId]),
    pool.query(shapeQuery, [userId]),
    pool.query(colorQuery, [userId]),
    pool.query(clarityQuery, [userId])
  ]);

  return {
    categories: categories.rows.length > 0 ? categories.rows.map(r => r.category) : ["RING", "NECKLACE", "EARRINGS", "BRACELET", "PENDANT", "BANGLE", "BROOCH", "OTHER"],
    materials: materials.rows.length > 0 ? materials.rows.map(r => r.material) : ["GOLD", "WHITE GOLD", "ROSE GOLD", "PLATINUM", "YELLOW GOLD"],
    statuses: statuses.rows.length > 0 ? statuses.rows.map(r => r.status) : ["AVAILABLE", "SOLD"],
    shapes: shapes.rows.length > 0 ? shapes.rows.map(r => r.diamond_shape) : ["ROUND", "PRINCESS", "PEAR", "OVAL", "EMERALD", "MARQUISE", "HEART", "CUSHION"],
    colors: colors.rows.length > 0 ? colors.rows.map(r => r.diamond_color) : ["D", "E", "F", "G", "H", "I", "J"],
    clarities: clarities.rows.length > 0 ? clarities.rows.map(r => r.diamond_clarity) : ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"]
  };
};

export const getPublicFilterOptions = async () => {
  const categoryQuery = `SELECT DISTINCT category FROM jewellery_stock WHERE category IS NOT NULL ORDER BY category`;
  const materialQuery = `SELECT DISTINCT material FROM jewellery_stock WHERE material IS NOT NULL ORDER BY material`;
  const statusQuery = `SELECT DISTINCT status FROM jewellery_stock WHERE status IS NOT NULL ORDER BY status`;
  const shapeQuery = `SELECT DISTINCT diamond_shape FROM jewellery_stock WHERE diamond_shape IS NOT NULL ORDER BY diamond_shape`;
  const colorQuery = `SELECT DISTINCT diamond_color FROM jewellery_stock WHERE diamond_color IS NOT NULL ORDER BY diamond_color`;
  const clarityQuery = `SELECT DISTINCT diamond_clarity FROM jewellery_stock WHERE diamond_clarity IS NOT NULL ORDER BY diamond_clarity`;

  const [categories, materials, statuses, shapes, colors, clarities] = await Promise.all([
    pool.query(categoryQuery),
    pool.query(materialQuery),
    pool.query(statusQuery),
    pool.query(shapeQuery),
    pool.query(colorQuery),
    pool.query(clarityQuery)
  ]);

  return {
    categories: categories.rows.length > 0 ? categories.rows.map(r => r.category) : ["RING", "NECKLACE", "EARRINGS", "BRACELET", "PENDANT", "BANGLE", "BROOCH", "OTHER"],
    materials: materials.rows.length > 0 ? materials.rows.map(r => r.material) : ["GOLD", "WHITE GOLD", "ROSE GOLD", "PLATINUM", "YELLOW GOLD"],
    statuses: statuses.rows.length > 0 ? statuses.rows.map(r => r.status) : ["AVAILABLE", "SOLD"],
    shapes: shapes.rows.length > 0 ? shapes.rows.map(r => r.diamond_shape) : ["ROUND", "PRINCESS", "PEAR", "OVAL", "EMERALD", "MARQUISE", "HEART", "CUSHION"],
    colors: colors.rows.length > 0 ? colors.rows.map(r => r.diamond_color) : ["D", "E", "F", "G", "H", "I", "J"],
    clarities: clarities.rows.length > 0 ? clarities.rows.map(r => r.diamond_clarity) : ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"]
  };
};

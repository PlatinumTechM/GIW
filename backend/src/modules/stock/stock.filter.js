// Filter builder for stock queries
// Handles all filter conditions for getAll and getByUserId queries

/**
 * Build filter conditions and values for stock queries
 * @param {Object} filters - Filter parameters
 * @param {number} startIndex - Starting parameter index for SQL placeholders
 * @param {string[]} baseConditions - Base WHERE conditions (e.g., ["user_id = $1"])
 * @returns {Object} { whereConditions: string[], values: any[], paramIndex: number }
 */
export const buildStockFilters = (filters, startIndex = 1, baseConditions = []) => {
  const whereConditions = [...baseConditions];
  const values = [];
  let paramIndex = startIndex;

  // If base conditions exist, add their values first
  // Note: Base condition values should be passed separately

  // Stock ID filter
  if (filters.stockId) {
    whereConditions.push(`stock_id ILIKE $${paramIndex}`);
    values.push(`%${filters.stockId}%`);
    paramIndex++;
  }

  // Certificate filter
  if (filters.certificate) {
    whereConditions.push(`certificate_number ILIKE $${paramIndex}`);
    values.push(`%${filters.certificate}%`);
    paramIndex++;
  }

  // Status filter (can be single value or comma-separated for multiple)
  if (filters.status) {
    const statuses = filters.status.split(",").map((s) => s.trim().toUpperCase());
    if (statuses.length === 1) {
      whereConditions.push(`status = $${paramIndex}`);
      values.push(statuses[0]);
      paramIndex++;
    } else {
      const placeholders = statuses.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`status IN (${placeholders})`);
      values.push(...statuses);
      paramIndex += statuses.length;
    }
  }

  // Shape filter (can be comma-separated for multiple)
  if (filters.shape) {
    const shapes = filters.shape.split(",").map((s) => s.trim().toUpperCase());
    if (shapes.length === 1) {
      whereConditions.push(`shape ILIKE $${paramIndex}`);
      values.push(`%${shapes[0]}%`);
      paramIndex++;
    } else {
      const placeholders = shapes.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`UPPER(shape) IN (${placeholders})`);
      values.push(...shapes);
      paramIndex += shapes.length;
    }
  }

  // Weight range filters
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

  // Color filter (can be comma-separated for multiple)
  if (filters.color) {
    const colors = filters.color.split(",").map((c) => c.trim().toUpperCase());
    if (colors.length === 1) {
      whereConditions.push(`color ILIKE $${paramIndex}`);
      values.push(`%${colors[0]}%`);
      paramIndex++;
    } else {
      const placeholders = colors.map((_, i) => `$${paramIndex + i}`).join(",");
      // Use ILIKE ANY for case-insensitive partial matching
      whereConditions.push(`color ILIKE ANY(ARRAY[${placeholders}])`);
      values.push(...colors.map((c) => `%${c}%`));
      paramIndex += colors.length;
    }
  }

  // Cut filter (can be comma-separated for multiple)
  if (filters.cut) {
    const cuts = filters.cut.split(",").map((c) => c.trim());
    if (cuts.length === 1) {
      whereConditions.push(`cut ILIKE $${paramIndex}`);
      values.push(`%${cuts[0]}%`);
      paramIndex++;
    } else {
      const placeholders = cuts.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`cut ILIKE ANY(ARRAY[${placeholders}])`);
      values.push(...cuts.map((c) => `%${c}%`));
      paramIndex += cuts.length;
    }
  }

  // Clarity filter (can be comma-separated for multiple)
  if (filters.clarity) {
    const clarities = filters.clarity.split(",").map((c) => c.trim().toUpperCase());
    if (clarities.length === 1) {
      whereConditions.push(`clarity ILIKE $${paramIndex}`);
      values.push(`%${clarities[0]}%`);
      paramIndex++;
    } else {
      const placeholders = clarities.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`UPPER(clarity) IN (${placeholders})`);
      values.push(...clarities);
      paramIndex += clarities.length;
    }
  }

  // Lab filter (can be comma-separated for multiple)
  if (filters.lab) {
    const labs = filters.lab.split(",").map((l) => l.trim().toUpperCase());
    if (labs.length === 1) {
      whereConditions.push(`lab ILIKE $${paramIndex}`);
      values.push(`%${labs[0]}%`);
      paramIndex++;
    } else {
      const placeholders = labs.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`UPPER(lab) IN (${placeholders})`);
      values.push(...labs);
      paramIndex += labs.length;
    }
  }

  // Price per carat range filters
  if (filters.minPricePerCarat) {
    whereConditions.push(`price_per_carat >= $${paramIndex}`);
    values.push(filters.minPricePerCarat);
    paramIndex++;
  }
  if (filters.maxPricePerCarat) {
    whereConditions.push(`price_per_carat <= $${paramIndex}`);
    values.push(filters.maxPricePerCarat);
    paramIndex++;
  }

  // Growth type filter (can be comma-separated for multiple)
  if (filters.growthType) {
    const growthTypes = filters.growthType.split(",").map((g) => g.trim().toUpperCase());
    if (growthTypes.length === 1) {
      whereConditions.push(`growth_type ILIKE $${paramIndex}`);
      values.push(`%${growthTypes[0]}%`);
      paramIndex++;
    } else {
      const placeholders = growthTypes.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`UPPER(growth_type) IN (${placeholders})`);
      values.push(...growthTypes);
      paramIndex += growthTypes.length;
    }
  }

  // Global search
  if (filters.search) {
    whereConditions.push(`(
      stock_id ILIKE $${paramIndex} OR
      certificate_number ILIKE $${paramIndex} OR
      shape ILIKE $${paramIndex} OR
      color ILIKE $${paramIndex} OR
      clarity ILIKE $${paramIndex} OR
      lab ILIKE $${paramIndex} OR
      cut ILIKE $${paramIndex}
    )`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  return {
    whereConditions,
    values,
    paramIndex,
  };
};

/**
 * Get sort column and order
 * @param {Object} filters - Filter parameters containing sortBy and sortOrder
 * @returns {Object} { sortBy: string, sortOrder: string }
 */
export const getSortConfig = (filters) => {
  const validSortColumns = [
    "stock_id", "certificate_number", "weight", "shape", "color", "clarity",
    "cut", "lab", "price_per_carat", "final_price", "growth_type", "status",
    "created_at"
  ];

  const sortBy = validSortColumns.includes(filters.sortBy) ? filters.sortBy : "created_at";
  const sortOrder = filters.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  return { sortBy, sortOrder };
};

/**
 * Build WHERE clause string from conditions
 * @param {string[]} whereConditions - Array of WHERE conditions
 * @returns {string} WHERE clause or empty string
 */
export const buildWhereClause = (whereConditions) => {
  return whereConditions.length > 0
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";
};

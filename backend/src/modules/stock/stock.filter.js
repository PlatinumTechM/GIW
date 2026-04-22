// Filter builder for stock queries
// Handles all filter conditions for getAll and getByUserId queries

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
    "IDEAL": "ID",
    "EXCELLENT": "EX",
    "VERY GOOD": "VG",
  };
  return mappings[upperValue] || value.trim();
};

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
    const cuts = filters.cut.split(",").map((c) => mapFilterValue(c));
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

  // Polish filter (can be comma-separated for multiple)
  if (filters.polish) {
    const polishes = filters.polish.split(",").map((p) => mapFilterValue(p));
    if (polishes.length === 1) {
      whereConditions.push(`polish ILIKE $${paramIndex}`);
      values.push(`%${polishes[0]}%`);
      paramIndex++;
    } else {
      const placeholders = polishes.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`polish ILIKE ANY(ARRAY[${placeholders}])`);
      values.push(...polishes.map((p) => `%${p}%`));
      paramIndex += polishes.length;
    }
  }

  // Symmetry filter (can be comma-separated for multiple)
  if (filters.symmetry) {
    const symmetries = filters.symmetry.split(",").map((s) => mapFilterValue(s));
    if (symmetries.length === 1) {
      whereConditions.push(`symmetry ILIKE $${paramIndex}`);
      values.push(`%${symmetries[0]}%`);
      paramIndex++;
    } else {
      const placeholders = symmetries.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`symmetry ILIKE ANY(ARRAY[${placeholders}])`);
      values.push(...symmetries.map((s) => `%${s}%`));
      paramIndex += symmetries.length;
    }
  }

  // Fancy Color filters (can be comma-separated for multiple)
  if (filters.fancyColor) {
    const fancyColors = filters.fancyColor.split(",").map((c) => c.trim());
    if (fancyColors.length === 1) {
      whereConditions.push(`fancy_color ILIKE $${paramIndex}`);
      values.push(`%${fancyColors[0]}%`);
      paramIndex++;
    } else {
      const placeholders = fancyColors.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`fancy_color ILIKE ANY(ARRAY[${placeholders}])`);
      values.push(...fancyColors.map((c) => `%${c}%`));
      paramIndex += fancyColors.length;
    }
  }

  if (filters.fancyIntensity) {
    const intensities = filters.fancyIntensity.split(",").map((i) => i.trim().toUpperCase());
    if (intensities.length === 1) {
      whereConditions.push(`UPPER(fancy_color_intensity) = $${paramIndex}`);
      values.push(intensities[0]);
      paramIndex++;
    } else {
      const placeholders = intensities.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`UPPER(fancy_color_intensity) IN (${placeholders})`);
      values.push(...intensities);
      paramIndex += intensities.length;
    }
  }

  if (filters.fancyOvertone) {
    const overtones = filters.fancyOvertone.split(",").map((o) => o.trim().toUpperCase());
    if (overtones.length === 1) {
      whereConditions.push(`UPPER(fancy_color_overtone) = $${paramIndex}`);
      values.push(overtones[0]);
      paramIndex++;
    } else {
      const placeholders = overtones.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`UPPER(fancy_color_overtone) IN (${placeholders})`);
      values.push(...overtones);
      paramIndex += overtones.length;
    }
  }

  // Certificate type filter (Certified vs Non-Certified)
  if (filters.certificateType === "certified") {
    whereConditions.push(`(lab IS NOT NULL AND lab <> '')`);
  } else if (filters.certificateType === "non-certified") {
    whereConditions.push(`(lab IS NULL OR lab = '')`);
  }

  // Fluorescence filter (can be comma-separated for multiple)
  if (filters.fluorescence) {
    const fluor = filters.fluorescence.split(",").map((f) => f.trim());
    if (fluor.length === 1) {
      whereConditions.push(`fluorescence ILIKE $${paramIndex}`);
      values.push(`%${fluor[0]}%`);
      paramIndex++;
    } else {
      const placeholders = fluor.map((_, i) => `$${paramIndex + i}`).join(",");
      whereConditions.push(`fluorescence ILIKE ANY(ARRAY[${placeholders}])`);
      values.push(...fluor.map((f) => `%${f}%`));
      paramIndex += fluor.length;
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
  // Map frontend sort values to database columns
  const sortMappings = {
    "featured": { column: "created_at", order: "DESC" },
    "price-low": { column: "final_price", order: "ASC" },
    "price-high": { column: "final_price", order: "DESC" },
    "carat-low": { column: "weight", order: "ASC" },
    "carat-high": { column: "weight", order: "DESC" },
    "color": { column: "color", order: "ASC" },
    // Direct column mappings
    "stock_id": { column: "stock_id", order: "DESC" },
    "certificate_number": { column: "certificate_number", order: "DESC" },
    "weight": { column: "weight", order: "DESC" },
    "shape": { column: "shape", order: "ASC" },
    "clarity": { column: "clarity", order: "ASC" },
    "cut": { column: "cut", order: "ASC" },
    "lab": { column: "lab", order: "ASC" },
    "price_per_carat": { column: "price_per_carat", order: "DESC" },
    "final_price": { column: "final_price", order: "DESC" },
    "growth_type": { column: "growth_type", order: "ASC" },
    "status": { column: "status", order: "ASC" },
    "created_at": { column: "created_at", order: "DESC" }
  };

  const mapping = sortMappings[filters.sortBy];

  if (mapping) {
    return { sortBy: mapping.column, sortOrder: mapping.order };
  }

  // Default fallback
  const sortOrder = filters.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  return { sortBy: "created_at", sortOrder };
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

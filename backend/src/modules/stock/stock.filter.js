// Simplified Filter builder for stock queries

const NON_CERTIFIED_LAB_TOKEN = "NON CERTIFIED";
const NON_CERTIFIED_CERTIFICATE_CONDITION =
  "(certificate_number IS NULL OR TRIM(certificate_number) = '')";

// Helper: Add array filter (status, shape, color, etc.)
// Returns true if filter was added
const addArrayFilter = (conditions, values, field, filterValue, paramIndex) => {
  // Convert string to array if needed (URL query params send strings)
  let itemsArray;
  if (typeof filterValue === "string") {
    itemsArray = filterValue.split(",");
  } else if (Array.isArray(filterValue)) {
    itemsArray = filterValue;
  } else {
    return { added: false, paramIndex };
  }

  if (!itemsArray || itemsArray.length === 0) return { added: false, paramIndex };

  // Filter out empty values
  const items = itemsArray.filter(item => item && item.trim()).map(item => item.trim().toUpperCase());
  if (items.length === 0) return { added: false, paramIndex };

  if (items.length === 1) {
    // Single value - use equals
    conditions.push(`UPPER(${field}) = $${paramIndex}`);
    values.push(items[0]);
    return { added: true, paramIndex: paramIndex + 1 };
  } else {
    // Multiple values - use IN
    const placeholders = items.map((_, i) => `$${paramIndex + i}`).join(",");
    conditions.push(`UPPER(${field}) IN (${placeholders})`);
    values.push(...items);
    return { added: true, paramIndex: paramIndex + items.length };
  }
};

// Helper: Add text search filter
const addTextFilter = (conditions, values, field, filterValue, paramIndex) => {
  if (!filterValue) return { added: false, paramIndex };
  conditions.push(`${field} ILIKE $${paramIndex}`);
  values.push(`%${filterValue}%`);
  return { added: true, paramIndex: paramIndex + 1 };
};

// Helper: Add number range filter
const addRangeFilter = (conditions, values, field, minValue, maxValue, paramIndex) => {
  let newIndex = paramIndex;
  if (minValue) {
    conditions.push(`${field} >= $${newIndex}`);
    values.push(parseFloat(minValue));
    newIndex++;
  }
  if (maxValue) {
    conditions.push(`${field} <= $${newIndex}`);
    values.push(parseFloat(maxValue));
    newIndex++;
  }
  return { added: minValue || maxValue, paramIndex: newIndex };
};

// Helper: Add boolean filter
const addBooleanFilter = (conditions, values, field, filterValue, paramIndex) => {
  if (filterValue === undefined || filterValue === null || filterValue === '') {
    return { added: false, paramIndex };
  }
  // Convert string 'true'/'false' to boolean
  const boolValue = filterValue === true || filterValue === 'true' || filterValue === '1';
  // Only add condition if value is true (checked), ignore if false (unchecked)
  if (!boolValue) {
    return { added: false, paramIndex };
  }
  conditions.push(`${field} = $${paramIndex}`);
  values.push(boolValue);
  return { added: true, paramIndex: paramIndex + 1 };
};

const normalizeLabFilterValue = (value) => {
  if (value === null || value === undefined) return "";
  return value
    .toString()
    .trim()
    .replace(/[\s_-]+/g, " ")
    .toUpperCase();
};

// Special handling for Lab filter:
// - Selecting "NON CERTIFIED" returns rows with NULL/empty certificate_number
// - If combined with other labs, returns (lab in selected OR non-certified)
const addLabFilter = (conditions, values, filterValue, paramIndex, tableAlias = '') => {
  const alias = tableAlias ? `${tableAlias}.` : '';
  let itemsArray;
  if (typeof filterValue === "string") {
    itemsArray = filterValue.split(",");
  } else if (Array.isArray(filterValue)) {
    itemsArray = filterValue;
  } else {
    return { added: false, paramIndex };
  }

  const items = itemsArray
    .map(normalizeLabFilterValue)
    .filter((v) => v);
  if (items.length === 0) return { added: false, paramIndex };

  const hasNonCertified = items.includes(NON_CERTIFIED_LAB_TOKEN);
  const labs = items.filter((v) => v !== NON_CERTIFIED_LAB_TOKEN);

  // Use alias for NON_CERTIFIED_CERTIFICATE_CONDITION
  const nonCertifiedCondition = `(${alias}certificate_number IS NULL OR TRIM(${alias}certificate_number) = '')`;

  // Only non-certified selected
  if (hasNonCertified && labs.length === 0) {
    conditions.push(`(${nonCertifiedCondition})`);
    return { added: true, paramIndex };
  }

  // Only real labs selected
  if (!hasNonCertified && labs.length > 0) {
    const placeholders = labs.map((_, i) => `$${paramIndex + i}`).join(",");
    conditions.push(`UPPER(${alias}lab) IN (${placeholders})`);
    values.push(...labs);
    return { added: true, paramIndex: paramIndex + labs.length };
  }

  // Mix of labs + non-certified (OR)
  const placeholders = labs.map((_, i) => `$${paramIndex + i}`).join(",");
  conditions.push(
    `(UPPER(${alias}lab) IN (${placeholders}) OR ${nonCertifiedCondition})`,
  );
  values.push(...labs);
  return { added: true, paramIndex: paramIndex + labs.length };
};

const addColorFilter = (conditions, values, filterValue, paramIndex, tableAlias = '') => {
  const alias = tableAlias ? `${tableAlias}.` : '';
  let itemsArray;
  if (typeof filterValue === "string") {
    itemsArray = filterValue.split(",");
  } else if (Array.isArray(filterValue)) {
    itemsArray = filterValue;
  } else {
    return { added: false, paramIndex };
  }

  const items = itemsArray
    .filter((item) => item && item.trim())
    .map((item) => item.trim().toUpperCase());
  if (items.length === 0) return { added: false, paramIndex };

  const placeholders = items.map((_, i) => `$${paramIndex + i}`).join(",");
  conditions.push(
    `(${alias}color IN (${placeholders}) OR ${alias}fancy_color IN (${placeholders}))`,
  );
  values.push(...items);
  return { added: true, paramIndex: paramIndex + items.length };
};

// Predefined shapes that are considered "standard" (not OTHER)
const PREDEFINED_SHAPES = [
  "ROUND", "PEAR", "OVAL", "PRINCESS", "EMERALD", "CUSHION", "MARQUISE",
  "HEART", "RADIANT", "BAGUETTE", "HEXAGONAL", "SQUARE EMERALD", "BRIOLETTE",
  "TRILLIANT", "HALF MOON", "ROSE CUT", "KITE"
];

// Helper: Add shape filter with special handling for "OTHER"
const addShapeFilter = (conditions, values, filterValue, paramIndex, tableAlias = '') => {
  const alias = tableAlias ? `${tableAlias}.` : '';
  if (!filterValue) return { added: false, paramIndex };

  // Convert string to array if needed
  let itemsArray;
  if (typeof filterValue === "string") {
    itemsArray = filterValue.split(",");
  } else if (Array.isArray(filterValue)) {
    itemsArray = filterValue;
  } else {
    return { added: false, paramIndex };
  }

  if (!itemsArray || itemsArray.length === 0) return { added: false, paramIndex };

  // Filter out empty values and normalize
  const items = itemsArray.filter(item => item && item.trim()).map(item => item.trim().toUpperCase());
  if (items.length === 0) return { added: false, paramIndex };

  // Check if "OTHER" is selected
  const hasOther = items.includes("OTHER");
  const specificShapes = items.filter(s => s !== "OTHER");

  if (hasOther) {
    if (specificShapes.length > 0) {
      // OTHER + specific shapes: show shapes not in predefined OR matching specific shapes
      const placeholders = PREDEFINED_SHAPES.map((_, i) => `$${paramIndex + i}`).join(",");
      conditions.push(`(UPPER(${alias}shape) NOT IN (${placeholders}) OR UPPER(${alias}shape) = ANY($${paramIndex + PREDEFINED_SHAPES.length}))`);
      values.push(...PREDEFINED_SHAPES, specificShapes);
      return { added: true, paramIndex: paramIndex + PREDEFINED_SHAPES.length + 1 };
    } else {
      // Only OTHER selected: show shapes not in predefined list
      const placeholders = PREDEFINED_SHAPES.map((_, i) => `$${paramIndex + i}`).join(",");
      conditions.push(`UPPER(${alias}shape) NOT IN (${placeholders})`);
      values.push(...PREDEFINED_SHAPES);
      return { added: true, paramIndex: paramIndex + PREDEFINED_SHAPES.length };
    }
  } else {
    // Normal shape filtering - only specific shapes
    const placeholders = specificShapes.map((_, i) => `$${paramIndex + i}`).join(",");
    conditions.push(`UPPER(${alias}shape) IN (${placeholders})`);
    values.push(...specificShapes);
    return { added: true, paramIndex: paramIndex + specificShapes.length };
  }
};

// Main function: Build SQL WHERE conditions from filter object
export const buildStockFilters = (filters, startIndex = 1, baseConditions = [], tableAlias = '') => {
  const alias = tableAlias ? `${tableAlias}.` : '';
  const whereConditions = [...baseConditions];
  const values = [];
  let paramIndex = startIndex;
  let result;

  // Text filters
  result = addTextFilter(whereConditions, values, `${alias}stock_id`, filters.stockId, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addTextFilter(whereConditions, values, `${alias}certificate_number`, filters.certificate, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  // Array filters (dropdown multi-selects)
  result = addArrayFilter(whereConditions, values, `${alias}status`, filters.status, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, "party", filters.party, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  // Shape filter with special handling for "OTHER"
  // Note: addShapeFilter needs update to support alias
  result = addShapeFilter(whereConditions, values, filters.shape, paramIndex, tableAlias);
  if (result.added) paramIndex = result.paramIndex;

  result = addColorFilter(whereConditions, values, filters.color, paramIndex, tableAlias);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, `${alias}cut`, filters.cut, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, `${alias}clarity`, filters.clarity, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addLabFilter(whereConditions, values, filters.lab, paramIndex, tableAlias);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, `${alias}growth_type`, filters.growthType, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, `${alias}treatment`, filters.treatment, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, `${alias}milky`, filters.milky, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, `${alias}eye_clean`, filters.eyeClean, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, `${alias}shade`, filters.shade, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  // Boolean filters
  result = addBooleanFilter(whereConditions, values, `${alias}heart_arrow`, filters.heartArrow, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addBooleanFilter(whereConditions, values, `${alias}no_bgm`, filters.no_bgm || filters.noBgm, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  // Location filter (search across city, state, country)
  if (filters.location) {
    const searchTerm = `%${filters.location}%`;
    whereConditions.push(`(${alias}city ILIKE $${paramIndex} OR ${alias}state ILIKE $${paramIndex} OR ${alias}country ILIKE $${paramIndex})`);
    values.push(searchTerm);
    paramIndex += 1;
  }

  // Supplier filter (search by company name in users table)
  if (filters.supplier) {
    const searchTerm = `%${filters.supplier}%`;
    whereConditions.push(`(u.company ILIKE $${paramIndex} AND u.role = 'seller')`);
    values.push(searchTerm);
    paramIndex += 1;
  }

  // Number range filters
  result = addRangeFilter(whereConditions, values, `${alias}weight`, filters.minWeight, filters.maxWeight, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}price_per_carat`, filters.minPricePerCarat, filters.maxPricePerCarat, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}final_price`, filters.minPrice, filters.maxPrice, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  // Measurement range filters
  result = addRangeFilter(whereConditions, values, `${alias}length`, filters.minLength, filters.maxLength, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}width`, filters.minWidth, filters.maxWidth, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}height`, filters.minHeight, filters.maxHeight, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}lw_ratio`, filters.minRatio, filters.maxRatio, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}depth_percentage`, filters.minDepth, filters.maxDepth, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}table_percentage`, filters.minTable, filters.maxTable, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}crown_height`, filters.minCrownHeight, filters.maxCrownHeight, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}crown_angle`, filters.minCrownAngle, filters.maxCrownAngle, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}pavilion_depth`, filters.minPavilionDepth, filters.maxPavilionDepth, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}pavilion_angle`, filters.minPavilionAngle, filters.maxPavilionAngle, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, `${alias}gridle_per`, filters.minGirdle, filters.maxGirdle, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  return { whereConditions, values, paramIndex };
};

// Get sort configuration
export const getSortConfig = (filters) => {
  let sortBy = "created_at";
  let sortOrder = "DESC";

  switch (filters.sortBy) {
    case "price-low":
      sortBy = "final_price";
      sortOrder = "ASC";
      break;
    case "price-high":
      sortBy = "final_price";
      sortOrder = "DESC";
      break;
    case "carat-low":
      sortBy = "weight";
      sortOrder = "ASC";
      break;
    case "carat-high":
      sortBy = "weight";
      sortOrder = "DESC";
      break;
    case "color":
      sortBy = "color";
      sortOrder = "ASC";
      break;
    case "clarity":
      sortBy = "clarity";
      sortOrder = "ASC";
      break;
    case "stock-id":
      sortBy = "stock_id";
      sortOrder = "ASC";
      break;
    case "featured":
    default:
      sortBy = "created_at";
      sortOrder = "DESC";
  }

  // If sortOrder was explicitly provided, override
  if (filters.sortOrder === "ASC" || filters.sortOrder === "DESC") {
    sortOrder = filters.sortOrder;
  }

  // Add id as secondary sort for deterministic pagination
  const orderClause = `${sortBy} ${sortOrder}, id ${sortOrder}`;
  return { sortBy, sortOrder, orderClause };
};

// Build WHERE clause string
export const buildWhereClause = (whereConditions) => {
  return whereConditions.length > 0
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";
};

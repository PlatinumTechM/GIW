// Simplified Filter builder for stock queries

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
    conditions.push(`${field} = $${paramIndex}`);
    values.push(items[0]);
    return { added: true, paramIndex: paramIndex + 1 };
  } else {
    // Multiple values - use IN
    const placeholders = items.map((_, i) => `$${paramIndex + i}`).join(",");
    conditions.push(`${field} IN (${placeholders})`);
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

// Main function: Build SQL WHERE conditions from filter object
export const buildStockFilters = (filters, startIndex = 1, baseConditions = []) => {
  const whereConditions = [...baseConditions];
  const values = [];
  let paramIndex = startIndex;
  let result;

  // Text filters
  result = addTextFilter(whereConditions, values, "stock_id", filters.stockId, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addTextFilter(whereConditions, values, "certificate_number", filters.certificate, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  // Array filters (dropdown multi-selects)
  result = addArrayFilter(whereConditions, values, "status", filters.status, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, "shape", filters.shape, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, "color", filters.color, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, "cut", filters.cut, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, "clarity", filters.clarity, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, "lab", filters.lab, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addArrayFilter(whereConditions, values, "growth_type", filters.growthType, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  // Number range filters
  result = addRangeFilter(whereConditions, values, "weight", filters.minWeight, filters.maxWeight, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  result = addRangeFilter(whereConditions, values, "price_per_carat", filters.minPricePerCarat, filters.maxPricePerCarat, paramIndex);
  if (result.added) paramIndex = result.paramIndex;

  // Global search (searches multiple fields)
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

  return { whereConditions, values, paramIndex };
};

// Get sort configuration
export const getSortConfig = (filters) => {
  const validColumns = ["stock_id", "weight", "color", "clarity", "created_at"];
  const sortBy = validColumns.includes(filters.sortBy) ? filters.sortBy : "created_at";
  const sortOrder = filters.sortOrder === "ASC" ? "ASC" : "DESC";
  // Add id as secondary sort for deterministic pagination
  const orderClause = sortBy === "created_at" 
    ? `created_at ${sortOrder}, id ${sortOrder}`
    : `${sortBy} ${sortOrder}, id ${sortOrder}`;
  return { sortBy, sortOrder, orderClause };
};

// Build WHERE clause string
export const buildWhereClause = (whereConditions) => {
  return whereConditions.length > 0
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";
};

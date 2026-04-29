import * as jewellryRepo from "./jewellry.repo.js";

// Field mapping for Excel Import
const FIELD_MAPPINGS = {
  stock_id: ["stock id", "stockid", "stock no", "stockno", "sku", "item code", "stock #"],
  name: ["name", "title", "product name", "item name"],
  description: ["description", "desc", "details"],
  design_number: ["design number", "design no", "design #", "model no"],
  brand: ["brand", "manufacturer", "make"],
  jewelry_style: ["style", "jewelry style", "jewelry style"],
  jewelry_sub_category: ["category", "sub category", "sub-category", "item type"],
  status: ["status", "availability", "available", "yes"],
  material: ["material", "metal", "metal type"],
  metal_purity: ["purity", "metal purity", "karat", "kt"],
  weight: ["weight", "metal weight", "gross weight", "g wt"],
  city: ["city", "location"],
  country: ["country"],
  price: ["price", "amount", "selling price", "rate"],

  // Center stone
  center_type: ["center growth", "center stone growth", "center type"],
  center_gem_type: ["center stone type", "center gem", "stone type", "diamond type"],
  center_gem_color: ["center gem color", "stone color"],
  center_shape: ["center shape", "stone shape", "diamond shape"],
  center_weight_cts: ["center weight", "stone weight", "diamond weight", "ct", "cts"],
  center_color_grade: ["center color", "color grade", "color"],
  center_clarity: ["center clarity", "clarity grade", "clarity"],
  center_cut: ["center cut", "cut grade", "cut"],
  center_polish: ["center polish", "polish"],
  center_symmetry: ["center symmetry", "symmetry"],
  center_fancy_color: ["center fancy color", "fancy color"],
  center_fancy_intensity: ["center fancy intensity", "intensity"],
  center_fluorescence_intensity: ["center fluorescence", "fluorescence", "fluor"],
  center_lab: ["center lab", "lab"],
  center_enhancement: ["center enhancement", "treatment"],
  center_total_stones: ["center stones count", "center stones"],
  center_measurement_length: ["center length", "length"],
  center_measurement_width: ["center width", "width"],
  center_measurement_depth: ["center depth", "depth"],

  // Side stones
  side_stone_type: ["side stone type", "side diamond type"],
  side_gem_type: ["side gem type"],
  side_gem_color: ["side gem color"],
  side_shape: ["side shape", "side diamond shape"],
  side_weight_cts: ["side weight", "side stone weight", "side diamond weight"],
  side_color_grade: ["side color grade", "side color"],
  side_clarity: ["side clarity"],
  side_fancy_color: ["side fancy color"],
  side_fancy_intensity: ["side fancy intensity"],
  side_total_stones: ["side stones count", "side stones"],

  mount: ["mount", "mounting", "setting"],
  certificate_number: ["certificate number", "certificate no", "cert no", "report no"],
  certificate_url: ["certificate url", "cert link", "report link"],
  lab: ["certificate lab"],
  is_featured: ["featured", "is featured"],
  is_customizable: ["customizable"]
};

const normalizeKey = (key) => {
  if (!key) return "";
  // Lowercase, trim, and replace underscores/dashes with spaces for flexible mapping
  return String(key).toLowerCase().trim().replace(/[_-]/g, " ").replace(/\s+/g, " ");
};

const mapExcelRow = (row) => {
  const mapped = {};
  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = normalizeKey(key);
    let found = false;

    for (const [standard, variations] of Object.entries(FIELD_MAPPINGS)) {
      if (variations.includes(normalizedKey)) {
        mapped[standard] = value;
        found = true;
        break;
      }
    }

    // Fallback: If not in FIELD_MAPPINGS, check if it matches a standard key directly
    if (!found) {
      const snakeKey = normalizedKey.replace(/\s+/g, "_");
      mapped[snakeKey] = value;
    }
  }
  return mapped;
};

const mapManualData = (data) => {
  const mapped = { ...data };

  // Map old fields to new ones if present
  if (data.category && !data.jewelry_sub_category) mapped.jewelry_sub_category = data.category;
  if (data.diamond_type && !data.center_gem_type) mapped.center_gem_type = data.diamond_type;
  if (data.diamond_shape && !data.center_shape) mapped.center_shape = data.diamond_shape;
  if (data.diamond_weight && !data.center_weight_cts) mapped.center_weight_cts = data.diamond_weight;
  if (data.diamond_color && !data.center_color_grade) mapped.center_color_grade = data.diamond_color;
  if (data.diamond_clarity && !data.center_clarity) mapped.center_clarity = data.diamond_clarity;
  if (data.diamond_cut && !data.center_cut) mapped.center_cut = data.diamond_cut;
  if (data.diamond_growth && !data.center_type) mapped.center_type = data.diamond_growth;

  if (data.side_diamond_type && !data.side_stone_type) mapped.side_stone_type = data.side_diamond_type;
  if (data.side_diamond_shape && !data.side_shape) mapped.side_shape = data.side_diamond_shape;
  if (data.side_diamond_weight && !data.side_weight_cts) mapped.side_weight_cts = data.side_diamond_weight;
  if (data.side_diamond_color && !data.side_color_grade) mapped.side_color_grade = data.side_diamond_color;
  if (data.side_diamond_clarity && !data.side_clarity) mapped.side_clarity = data.side_diamond_clarity;

  return mapped;
};

export const getAllJewellry = async (page, limit, sortBy, filters) => {
  return await jewellryRepo.getAll(page, limit, sortBy, filters);
};

export const getJewellryById = async (id) => {
  return await jewellryRepo.getById(id);
};

export const createJewellry = async (data) => {
  const mappedData = mapManualData(data);
  if (!mappedData.stock_id) {
    mappedData.stock_id = `JW-${Date.now()}`;
  } else {
    const existing = await jewellryRepo.getByStockIdAndUser(mappedData.stock_id, mappedData.user_id);
    if (existing) {
      throw new Error(`Stock ID "${mappedData.stock_id}" already exists in your inventory.`);
    }
  }
  return await jewellryRepo.create(mappedData);
};

export const updateJewellry = async (id, data) => {
  const mappedData = mapManualData(data);
  if (mappedData.stock_id) {
    const currentItem = await jewellryRepo.getById(id);
    if (currentItem && currentItem.stock_id !== mappedData.stock_id) {
      const existing = await jewellryRepo.getByStockIdAndUser(mappedData.stock_id, currentItem.user_id);
      if (existing) {
        throw new Error(`Stock ID "${mappedData.stock_id}" is already used by another item in your inventory.`);
      }
    }
  }
  return await jewellryRepo.update(id, mappedData);
};

export const deleteJewellry = async (id) => {
  return await jewellryRepo.deleteById(id);
};

export const getFilterOptions = async (userId) => {
  return await jewellryRepo.getFilterOptions(userId);
};

export const getPublicFilterOptions = async () => {
  return await jewellryRepo.getPublicFilterOptions();
};

export const bulkUpload = async (stockData, userId) => {
  const results = {
    insertedCount: 0,
    updatedCount: 0,
    skippedCount: 0,
    errors: []
  };

  for (const rawItem of stockData) {
    try {
      // Map and normalize the row
      const item = mapExcelRow(rawItem);
      const dbItem = { ...item, user_id: userId };

      // Basic normalization
      if (dbItem.stock_id) dbItem.stock_id = String(dbItem.stock_id).trim().toUpperCase();

      if (!dbItem.stock_id) {
        results.skippedCount++;
        results.errors.push({ item, error: "Missing Stock ID" });
        continue;
      }

      // Normalize status
      if (dbItem.status) {
        const s = String(dbItem.status).toLowerCase().trim();
        if (["yes", "y", "available", "true"].includes(s)) {
          dbItem.status = "AVAILABLE";
        } else if (["no", "n", "sold", "false"].includes(s)) {
          dbItem.status = "SOLD";
        } else {
          dbItem.status = s.toUpperCase();
        }
      } else {
        dbItem.status = "AVAILABLE";
      }

      const existing = await jewellryRepo.getByStockIdAndUser(dbItem.stock_id, userId);
      if (existing) {
        await jewellryRepo.update(existing.id, dbItem);
        results.updatedCount++;
      } else {
        await jewellryRepo.create(dbItem);
        results.insertedCount++;
      }
    } catch (error) {
      results.skippedCount++;
      results.errors.push({ item: rawItem.stock_id || "Unknown", error: error.message });
    }
  }

  return results;
};

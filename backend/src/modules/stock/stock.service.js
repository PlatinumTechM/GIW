import * as stockRepo from "./stock.repo.js";
import { ALL_COLUMNS } from "./stock.repo.js";
import { pool } from "../../config/db.js";

// Field mapping configuration - File columns to DB fields (diamond_stock table)

const FIELD_MAPPINGS = {
  // Basic fields

  type: ["type", "diamond type", "stone type"],

  stock_id: [
    "stock id",
    "stockid",
    "stock_id",
    "stock no",
    "stockno",
    "stock #",
    "packet no",
    "packetno",
    "stoneno",
    "stone no",
    "stone #",
    "stone id",
    "stoneno",
    "stone",
    "pkt no",
    "pkt #",
    "ref no",
    "ref #",
    "reference",
  ],

  certificate_number: [
    "certificate number",
    "cert no",
    "cert_no",
    "certificate_no",
    "cert #",
    "cert.",
    "certificate #",
    "report no",
    "report #",
    "lab no",
    "lab #",
    "report",
    "certificate",
    "cert",
    "inscription",
    "insc",
    "cert num",
    "report num",
  ],

  weight: [
    "weight",
    "carat",
    "carat weight",
    "ct",
    "cts",
    "carats",
    "crt",
    "carat wt",
  ],

  shape: ["shape", "shp", "diamond shape", "cut shape"],

  color: ["color", "colour", "col", "colors", "clr"],

  // Fancy color fields

  fancy_color: [
    "fancy color",
    "fancycolor",
    "fncy color",
    "fncy clr",
    "fan color",
    "f color",
  ],

  fancy_color_intensity: [
    "fancy color intensity",
    "intensity",
    "fancy intensity",
    "clr intensity",
    "color intensity",
    "fancy int",
  ],

  fancy_color_overtone: [
    "fancy color overtone",
    "overtone",
    "fancy overtone",
    "color overtone",
  ],

  // Grading fields

  clarity: ["clarity", "clar", "clr", "clarities", "purity"],

  cut: ["cut", "cut grade", "cut quality", "cutting"],

  polish: ["polish", "pol", "polish grade", "polishing", "pol q"],

  symmetry: ["symmetry", "sym", "symm", "symmetry grade", "sym grade", "sym q"],

  fluorescence: [
    "fluorescence",
    "fluor",
    "flr",
    "fl",
    "fluorescence grade",
    "fluor grade",
    "fl. grade",
  ],

  fluorescence_color: [
    "fluorescence color",
    "fl color",
    "fl. color",
    "fluor color",
    "fluor. color",
  ],

  fluorescence_intensity: [
    "fluorescence intensity",
    "fl intensity",
    "fl. intensity",
    "fluor intensity",
    "fl. int",
  ],

  // Measurements

  measurements: [
    "measurements",
    "meas",
    "dimension",
    "dimensions",
    "measurement",
  ],

  length: ["length", "l", "mm length", "len", "lngth", "measurements length"],

  width: ["width", "w", "mm width", "wid", "measurements width"],

  height: [
    "height",
    "h",
    "mm height",
    "depth",
    "ht",
    "dep",
    "measurements depth",
  ],

  // Additional properties

  shade: ["shade", "shd"],

  milky: ["milky", "milkiness", "milk", "mlk"],

  eye_clean: ["eye clean", "eyeclean", "eye", "ec", "e/c"],

  lab: ["lab", "laboratory", "certificate lab", "lab name", "certificate by"],

  certificate_comment: [
    "certificate comment",
    "cert comment",
    "comment",
    "comments",
    "cert comments",
    "remarks",
  ],

  // Location

  city: ["city", "town"],

  state: ["state", "province"],

  country: ["country", "cntry", "nation"],

  // Treatment

  treatment: ["treatment", "treated", "treat", "trt"],

  // Percentages

  depth_percentage: [
    "depth %",
    "depth percentage",
    "depth",
    "dep",
    "depth pct",
    "depth%",
    "tbl depth",
  ],

  table_percentage: [
    "table %",
    "table percentage",
    "table",
    "tbl",
    "table pct",
    "table%",
    "tbl%",
  ],

  // Pricing

  rap_price: ["rap price", "rap", "list price", "rap list", "base price"],

  rap_per_carat: [
    "rap per carat",
    "rap",
    "rap rate",
    "rap p/c",
    "rap/ct",
    "rap $/ct",
  ],

  price_per_carat: [
    "price per carat",
    "ppc",
    "per carat price",
    "rate per carat",
    "rate p/c",
    "$/ct",
    "price/carat",
    "price/ct",
    "$ per ct",
    "per ct price",
  ],

  final_price: [
    "final price",
    "total price",
    "amount",
    "total",
    "value",
    "price",
    "cost",
    "net price",
    "total amt",
  ],

  dollar_rate: [
    "dollar rate",
    "rate",
    "usd rate",
    "exchange rate",
    "$ rate",
    "usd",
  ],

  rs_amount: [
    "rs amount",
    "inr amount",
    "rupee amount",
    "local amount",
    "inr",
    "rs",
  ],

  discount: ["discount", "disc", "off", "disc %", "discount %", "less", "comm"],

  // Special features

  heart_arrow: ["heart arrow", "hearts arrow", "h&a"],

  star_length: ["star length"],

  laser_description: ["laser description", "laser inscription", "inscription"],

  growth_type: ["growth type", "growth"],

  key_to_symbol: ["key to symbol", "key to symbols", "symbols"],

  lw_ratio: [
    "lw ratio",
    "l/w ratio",
    "length width ratio",
    "ratio",
    "l-w ratio",
  ],

  // Culet

  culet_size: ["culet size", "culet"],

  culet_condition: ["culet condition", "culet cond"],

  // Gridle/Girdle

  gridle_thin: ["gridle thin", "girdle thin", "girdle min"],

  gridle_thick: ["gridle thick", "girdle thick", "girdle max"],

  gridle_condition: [
    "gridle condition",
    "girdle condition",
    "girdle cond",
    "gridle cond",
  ],

  gridle_per: ["gridle per", "girdle %", "girdle per"],

  // Crown

  crown_height: ["crown height"],

  crown_angle: ["crown angle"],

  // Pavilion

  pavilion_depth: ["pavilion depth"],

  pavilion_angle: ["pavilion angle"],

  // Status

  status: ["status", "availability", "available", "avail"],

  diamond_type: ["diamond type", "stone type", "stone"],

  // Media

  // diamond_image1: ["image 1", "image1", "photo 1", "pic 1"],
  // diamond_image1: ["image 1", "image1", "photo 1", "pic 1", "diamond_image", "diamond image"],
  diamond_image1: [
    "image 1",
    "image1",
    "photo 1",
    "pic 1",
    "image",
    "photo",
    "pic",
    "picture",
    "diamond_image",
    "diamond image",
    "diamondimage",
    "image_url",
    "image link",
    "image_url",
    "link",
    "url",
    "src",
    "source",
  ],
  // diamond_image2: ["image 2", "image2", "photo 2", "pic 2"],
  diamond_image2: [
    "image 2",
    "image2",
    "photo 2",
    "pic 2",
    "image",
    "photo",
    "pic",
    "picture",
    "diamond_image",
    "diamond image",
    "diamondimage",
    "image_url",
    "image link",
    "image_url",
    "link",
    "url",
    "src",
    "source",
  ],

  // diamond_image3: ["image 3", "image3", "photo 3", "pic 3"],
  diamond_image3: [
    "image 3",
    "image3",
    "photo 3",
    "pic 3",
    "image",
    "photo",
    "pic",
    "picture",
    "diamond_image",
    "diamond image",
    "diamondimage",
    "image_url",
    "image link",
    "image_url",
    "link",
    "url",
    "src",
    "source",
  ],
  // diamond_image4: ["image 4", "image4", "photo 4", "pic 4"],
  diamond_image4: [
    "image 4",
    "image4",
    "photo 4",
    "pic 4",
    "image",
    "photo",
    "pic",
    "picture",
    "diamond_image",
    "diamond image",
    "diamondimage",
    "image_url",
    "image link",
    "image_url",
    "link",
    "url",
    "src",
    "source",
  ],
  // diamond_image5: ["image 5", "image5", "photo 5", "pic 5"],
  diamond_image5: [
    "image 5",
    "image5",
    "photo 5",
    "pic 5",
    "image",
    "photo",
    "pic",
    "picture",
    "diamond_image",
    "diamond image",
    "diamondimage",
    "image_url",
    "image link",
    "image_url",
    "link",
    "url",
    "src",
    "source",
  ],

  diamond_video: ["video", "diamond video", "video link"],

  certificate_image: ["certificate image", "cert image", "certificate scan"],
};

// Only stock_id is required to identify a row for saving

// All other fields are optional - if data exists, save it; if not, save as null

const REQUIRED_FOR_SAVE = ["stock_id"];

// Normalize field name: convert to lowercase, clean, then match

const normalizeFieldName = (field) => {
  if (!field) return "";

  // Step 1: Convert to lowercase, trim, remove underscores/dashes, normalize spaces

  const normalized = String(field)
    .toLowerCase()
    .trim()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");

  // Step 2: Check against field mappings (variations already in lowercase)

  // First pass: check for exact matches (higher priority)

  for (const [standard, variations] of Object.entries(FIELD_MAPPINGS)) {
    for (const variation of variations) {
      if (normalized === variation) {
        return standard;
      }
    }
  }

  // Second pass: check for contains (lower priority, but be careful with generic terms)

  for (const [standard, variations] of Object.entries(FIELD_MAPPINGS)) {
    for (const variation of variations) {
      // For 'measurements', require exact match only (already checked above)

      // This prevents 'measurements length' from matching with 'measurements'

      if (standard === "measurements") continue;

      if (normalized.includes(variation)) {
        return standard;
      }
    }
  }

  // Return cleaned version if no match

  return normalized.replace(/\s+/g, "_");
};

// Map file data to database format

const mapFileToDb = (fileData) => {
  const mapped = {};

  for (const [key, value] of Object.entries(fileData)) {
    const normalizedKey = normalizeFieldName(key);

    if (
      normalizedKey &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      mapped[normalizedKey] = value;
    }
  }

  return mapped;
};

// Parse numeric value safely

const parseNumeric = (value, decimals = 3) => {
  if (value === null || value === undefined || value === "") return null;

  // Handle boolean values (Excel sometimes returns true/false for numeric cells)

  if (typeof value === "boolean") return value ? 1 : null;

  const parsed = parseFloat(value);

  return isNaN(parsed) ? null : parsed;
};

// Parse string value safely

const parseString = (value) => {
  if (value === null || value === undefined) return null;

  return String(value).trim();
};

// Value mappings for standardizing field values
const VALUE_MAPPINGS = {
  // Cut, Polish, Symmetry mappings (short codes and full words to full names)
  grading: {
    // Full word variations → full name
    EXCELLENT: "EXCELLENT",
    "VERY GOOD": "VERY GOOD",
    VERYGOOD: "VERY GOOD",
    IDEAL: "IDEAL",
    GOOD: "GOOD",
    FAIR: "FAIR",
    POOR: "POOR",
    // Short codes → full name
    EX: "EXCELLENT",
    VG: "VERY GOOD",
    ID: "IDEAL",
    GD: "GOOD",
    FR: "FAIR",
    PR: "POOR",
  },
  // Shape mappings (short form to long form)
  shape: {
    // Short codes → long form
    RD: "ROUND",
    PR: "PRINCESS",
    PN: "PEAR",
    EM: "EMERALD",
    MQ: "MARQUISE",
    OV: "OVAL",
    RAD: "RADIANT",
    CUS: "CUSHION",
    HT: "HEART",
    ASH: "ASSCHER",
    BG: "BAGUETTE",
    TRI: "TRILLIANT",
    TR: "TRILLIANT",
    // Long forms (pass-through)
    ROUND: "ROUND",
    PRINCESS: "PRINCESS",
    PEAR: "PEAR",
    EMERALD: "EMERALD",
    MARQUISE: "MARQUISE",
    OVAL: "OVAL",
    RADIANT: "RADIANT",
    CUSHION: "CUSHION",
    HEART: "HEART",
    ASSCHER: "ASSCHER",
    BAGUETTE: "BAGUETTE",
    TRILLIANT: "TRILLIANT",
  },
  // Status mappings
  status: {
    YES: "AVAILABLE",
    AVAILABLE: "AVAILABLE",
    AVAIL: "AVAILABLE",
    SOLD: "SOLD",
    "ON HOLD": "ON HOLD",
    ONHOLD: "ON HOLD",
    "IN MEMO": "IN MEMO",
    INMEMO: "IN MEMO",
    MEMO: "IN MEMO",
  },
};

// Map value using VALUE_MAPPINGS
const mapValue = (value, mappingType) => {
  if (!value) return null;

  const strValue = String(value).toUpperCase().trim();
  const mapping = VALUE_MAPPINGS[mappingType];

  if (!mapping) return strValue;

  return mapping[strValue] || strValue;
};

// Parse boolean value safely

const parseBoolean = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const str = String(value).toLowerCase().trim();

  if (str === "true" || str === "yes" || str === "1" || str === "y")
    return true;

  if (str === "false" || str === "no" || str === "0" || str === "n")
    return false;

  return null;
};

// Check if row has stock_id (required for saving to DB)

const hasStockId = (data) => {
  return data.stock_id && String(data.stock_id).trim().toUpperCase() !== "";
};

// Parse measurements string like "7.87-7.93*4.91" into length, width, height

// Format: length-width*height

const parseMeasurements = (measurementsStr) => {
  if (!measurementsStr || typeof measurementsStr !== "string") {
    return { length: null, width: null, height: null };
  }

  // Remove any whitespace

  const cleanStr = measurementsStr.trim();

  // Match pattern: number-number*number

  // Examples: "7.87-7.93*4.91", "10.10-7.22*4.91"

  const match = cleanStr.match(/^(\d+\.?\d*)-(\d+\.?\d*)\*(\d+\.?\d*)$/);

  if (match) {
    return {
      length: parseFloat(match[1]),

      width: parseFloat(match[2]),

      height: parseFloat(match[3]),
    };
  }

  // Try alternative patterns if main pattern doesn't match

  // Pattern: number*number*number (all asterisks)

  const altMatch = cleanStr.match(/^(\d+\.?\d*)\*(\d+\.?\d*)\*(\d+\.?\d*)$/);

  if (altMatch) {
    return {
      length: parseFloat(altMatch[1]),

      width: parseFloat(altMatch[2]),

      height: parseFloat(altMatch[3]),
    };
  }

  // Pattern: number-number-number (all dashes)

  const dashMatch = cleanStr.match(/^(\d+\.?\d*)-(\d+\.?\d*)-(\d+\.?\d*)$/);

  if (dashMatch) {
    return {
      length: parseFloat(dashMatch[1]),

      width: parseFloat(dashMatch[2]),

      height: parseFloat(dashMatch[3]),
    };
  }

  return { length: null, width: null, height: null };
};

// Convert mapped data to DB format with proper types

const convertToDbFormat = (mappedData, userId = null) => {
  return {
    type: parseString(mappedData.type),

    user_id: userId,

    stock_id: parseString(mappedData.stock_id)?.toUpperCase(),

    certificate_number: parseString(mappedData.certificate_number),

    weight: parseNumeric(mappedData.weight),

    shape: mapValue(parseString(mappedData.shape), "shape"),

    // Color logic: single char = color field, multiple words = split to fancy_color fields

    ...(() => {
      const rawColor = mappedData.color;

      const colorValue = parseString(rawColor)?.toUpperCase();

      if (!colorValue) {
        // No color value, check if fancy color fields are provided separately

        const result = {
          color: null,

          fancy_color: parseString(mappedData.fancy_color)?.toUpperCase(),

          fancy_color_intensity: parseString(
            mappedData.fancy_color_intensity,
          )?.toUpperCase(),

          fancy_color_overtone: parseString(
            mappedData.fancy_color_overtone,
          )?.toUpperCase(),
        };

        return result;
      }

      // Check if single character (D, E, F, G, etc.)

      if (colorValue.length === 1) {
        const result = {
          color: colorValue,

          fancy_color: parseString(mappedData.fancy_color)?.toUpperCase(),

          fancy_color_intensity: parseString(
            mappedData.fancy_color_intensity,
          )?.toUpperCase(),

          fancy_color_overtone: parseString(
            mappedData.fancy_color_overtone,
          )?.toUpperCase(),
        };

        return result;
      }

      // Multiple words - split by space for fancy color

      const parts = colorValue.split(/\s+/).filter((p) => p.length > 0);

      if (parts.length === 1) {
        // Single word but not single char (like "COLORLESS")

        const result = {
          color: colorValue,

          fancy_color: parseString(mappedData.fancy_color)?.toUpperCase(),

          fancy_color_intensity: parseString(
            mappedData.fancy_color_intensity,
          )?.toUpperCase(),

          fancy_color_overtone: parseString(
            mappedData.fancy_color_overtone,
          )?.toUpperCase(),
        };

        return result;
      }

      // Multiple words - assign to fancy color fields

      // First word -> fancy_color, Second -> fancy_color_intensity, Third -> fancy_color_overtone

      const result = {
        color: null, // Not a standard color, it's fancy

        fancy_color: parts[0] || null,

        fancy_color_intensity: parts[1] || null,

        fancy_color_overtone: parts[2] || null,
      };

      return result;
    })(),

    // Grading

    clarity: parseString(mappedData.clarity)?.toUpperCase(),

    cut: mapValue(parseString(mappedData.cut), "grading"),

    polish: mapValue(parseString(mappedData.polish), "grading"),

    symmetry: mapValue(parseString(mappedData.symmetry), "grading"),

    fluorescence: parseString(mappedData.fluorescence)?.toUpperCase(),

    fluorescence_color: parseString(mappedData.fluorescence_color),

    fluorescence_intensity: parseString(mappedData.fluorescence_intensity),

    // Measurements logic:

    // 1. If individual length/width/height are provided, use them and build measurements string

    // 2. Otherwise, try to parse measurements string to extract length/width/height

    ...(() => {
      // First, check for individual length/width/height values (PRIORITY)

      const l = parseNumeric(mappedData.length);

      const w = parseNumeric(mappedData.width);

      const h = parseNumeric(mappedData.height);

      // If all three individual values are provided, use them and build measurements string

      if (l !== null && w !== null && h !== null) {
        const measurementsValue = `${l}-${w}*${h}`;

        return {
          measurements: measurementsValue,

          length: l,

          width: w,

          height: h,
        };
      }

      // Otherwise, try to parse measurements string if available

      const measurementsStr = parseString(mappedData.measurements);

      if (measurementsStr) {
        const parsedFromMeasurements = parseMeasurements(measurementsStr);

        if (parsedFromMeasurements && parsedFromMeasurements.length !== null) {
          return {
            measurements: measurementsStr,

            length: parsedFromMeasurements.length,

            width: parsedFromMeasurements.width,

            height: parsedFromMeasurements.height,
          };
        }

        // If parsing failed but measurements string exists, keep it as-is

        return {
          measurements: measurementsStr,

          length: l,

          width: w,

          height: h,
        };
      }

      // No measurements string and incomplete individual values

      return {
        measurements: null,

        length: l,

        width: w,

        height: h,
      };
    })(),

    // Additional properties

    shade: parseString(mappedData.shade),

    milky: parseString(mappedData.milky),

    eye_clean: parseString(mappedData.eye_clean),

    lab: parseString(mappedData.lab)?.toUpperCase(),

    certificate_comment: parseString(mappedData.certificate_comment),

    // Location

    city: parseString(mappedData.city),

    state: parseString(mappedData.state),

    country: parseString(mappedData.country),

    // Treatment

    treatment: parseString(mappedData.treatment),

    // Percentages

    depth_percentage: parseNumeric(mappedData.depth_percentage),

    table_percentage: parseNumeric(mappedData.table_percentage),

    // Pricing

    rap_price: parseNumeric(mappedData.rap_price),

    rap_per_carat: parseNumeric(mappedData.rap_per_carat),

    price_per_carat: parseNumeric(mappedData.price_per_carat),

    final_price: parseNumeric(mappedData.final_price),

    dollar_rate: parseNumeric(mappedData.dollar_rate),

    rs_amount: parseNumeric(mappedData.rs_amount),

    discount: parseNumeric(mappedData.discount),

    // Special features

    heart_arrow: parseBoolean(mappedData.heart_arrow),

    star_length: parseString(mappedData.star_length),

    laser_description: parseString(mappedData.laser_description),

    growth_type: parseString(mappedData.growth_type),

    key_to_symbol: parseString(mappedData.key_to_symbol),

    lw_ratio: parseString(mappedData.lw_ratio),

    // Culet

    culet_size: parseString(mappedData.culet_size),

    culet_condition: parseString(mappedData.culet_condition),

    // Gridle/Girdle

    gridle_thin: parseString(mappedData.gridle_thin),

    gridle_thick: parseString(mappedData.gridle_thick),

    gridle_condition: parseString(mappedData.gridle_condition),

    gridle_per: parseString(mappedData.gridle_per),

    // Crown

    crown_height: parseString(mappedData.crown_height),

    crown_angle: parseString(mappedData.crown_angle),

    // Pavilion

    pavilion_depth: parseString(mappedData.pavilion_depth),

    pavilion_angle: parseString(mappedData.pavilion_angle),

    // Status - apply value mapping and convert to capital letters

    status: mapValue(parseString(mappedData.status), "status") || "AVAILABLE",

    diamond_type: parseString(mappedData.diamond_type),

    // Media URLs

    diamond_image1: parseString(mappedData.diamond_image1),

    diamond_image2: parseString(mappedData.diamond_image2),

    diamond_image3: parseString(mappedData.diamond_image3),

    diamond_image4: parseString(mappedData.diamond_image4),

    diamond_image5: parseString(mappedData.diamond_image5),

    diamond_video: parseString(mappedData.diamond_video),

    certificate_image: parseString(mappedData.certificate_image),
  };
};

export const bulkUpload = async (
  stockDataArray,
  userId = null,
  importType = null,
) => {
  const results = {
    insertedCount: 0,
    replacedCount: 0,
    skippedCount: 0,
    totalRows: stockDataArray.length,
    validRows: [], // Rows with stock_id that will be saved
    skippedRows: [], // Rows without stock_id that will be skipped
  };

  for (let i = 0; i < stockDataArray.length; i++) {
    const row = stockDataArray[i];
    const mappedData = mapFileToDb(row);

    // Only rows with stock_id will be saved to DB
    if (hasStockId(mappedData)) {
      const dbData = convertToDbFormat(mappedData, userId);
      // Apply import type if provided
      if (importType) {
        dbData.type = importType;
      }
      results.validRows.push(dbData);
    } else {
      results.skippedRows.push({
        row: i + 1,
        reason: "Missing stock_id",
        data: row,
      });
    }
  }

  results.skippedCount = results.skippedRows.length;

  // Save only rows with stock_id using transaction
  if (results.validRows.length > 0) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Step 1: Deduplicate rows by stock_id (keep last occurrence)
      const uniqueRowsMap = new Map();
      for (const row of results.validRows) {
        uniqueRowsMap.set(row.stock_id, row);
      }
      const uniqueRows = Array.from(uniqueRowsMap.values());

      // Step 2: Get all stock_ids from incoming data
      const incomingStockIds = uniqueRows
        .map((row) => row.stock_id)
        .filter((id) => id);

      // Step 3: Delete existing records with same stock_ids (replace behavior)
      if (incomingStockIds.length > 0) {
        const deletedCount = await stockRepo.deleteByStockIds(
          incomingStockIds,
          client,
        );
        results.replacedCount = deletedCount;
      }

      // Step 4: Insert deduplicated data
      const inserted = await stockRepo.bulkInsert(uniqueRows, client);
      results.insertedCount = inserted;

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  return results;
};

export const getAllStocks = async (page, limit, sortBy, filters) => {
  return await stockRepo.getAll(page, limit, sortBy, filters);
};

export const getStocksByUserId = async (userId, page, limit, filters = {}) => {
  return await stockRepo.getByUserId(userId, page, limit, filters);
};

export const getStockById = async (id) => {
  const stock = await stockRepo.getById(id);

  if (!stock) {
    throw new Error("Stock not found");
  }

  // Add availability flags for video and certificate
  return {
    ...stock,
    hasVideo: !!(
      stock.diamond_video &&
      stock.diamond_video.trim() !== "" &&
      stock.diamond_video.toUpperCase() !== "NONE"
    ),
    hasCertificate: !!(
      stock.certificate_image &&
      stock.certificate_image.trim() !== "" &&
      stock.certificate_image.toUpperCase() !== "NONE"
    ),
  };
};

export const createStock = async (stockData, userId = null) => {
  const mappedData = mapFileToDb(stockData);

  if (!hasStockId(mappedData)) {
    throw new Error("stock_id is required");
  }

  const dbData = convertToDbFormat(mappedData, userId);

  try {
    return await stockRepo.create(dbData);
  } catch (error) {
    // Handle unique constraint violation for stock_id
    if (
      error.code === "23505" &&
      error.constraint === "diamond_stock_stock_id_key"
    ) {
      throw new Error(
        `Stock ID "${dbData.stock_id}" already exists. Please use a different Stock ID.`,
      );
    }
    // Re-throw other errors
    throw error;
  }
};

export const updateStock = async (id, stockData) => {
  const existingStock = await stockRepo.getById(id);

  if (!existingStock) {
    throw new Error("Stock not found");
  }

  const mappedData = mapFileToDb(stockData);

  const dbData = convertToDbFormat(mappedData);

  // Remove null values for partial update

  const updateData = {};

  for (const [key, value] of Object.entries(dbData)) {
    if (value !== null && value !== undefined) {
      updateData[key] = value;
    }
  }

  return await stockRepo.update(id, updateData);
};

export const deleteStock = async (id) => {
  const existingStock = await stockRepo.getById(id);

  if (!existingStock) {
    throw new Error("Stock not found");
  }

  return await stockRepo.delete(id);
};

export const getFieldMapping = () => {
  return {
    requiredForSave: REQUIRED_FOR_SAVE,

    fieldMappings: FIELD_MAPPINGS,

    dbTable: "diamond_stock",

    dbFields: ALL_COLUMNS,
  };
};

export const getFilterOptions = async () => {
  return await stockRepo.getFilterOptions();
};

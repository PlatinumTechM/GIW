import * as shareRepo from "./share.repo.js";
import * as stockRepo from "../stock/stock.repo.js";
import { buildStockFilters, buildWhereClause, getSortConfig } from "../stock/stock.filter.js";
import crypto from "crypto";

const EXPIRY_HOURS = 24;

// Generate random 8-character token (e.g., "A3B7C9D2")
const generateToken = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

// Create new share link
export const generateShareLink = async (userId, shareData) => {
  const { filters, markupPercentage } = shareData;

  // Generate unique token
  let token = generateToken();
  while (await shareRepo.getShareLinkByToken(token)) {
    token = generateToken();
  }

  // Set expiry 24 hours from now
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + EXPIRY_HOURS);

  // Save to database with markup_percentage as separate column
  const shareLink = await shareRepo.createShareLink({
    token,
    userId,
    markupPercentage: parseFloat(markupPercentage) || 0,
    filters,
    expiry,
  });

  return {
    token: shareLink.token,
    expiry: shareLink.expiry,
    expiresIn: `${EXPIRY_HOURS} hours`,
    markupPercentage: parseFloat(markupPercentage) || 0,
  };
};

// Get stock data for shared link
export const getSharedStockData = async (token, queryParams = {}) => {
  // Find share link
  const shareLink = await shareRepo.getShareLinkByToken(token);

  if (!shareLink) {
    throw new Error("Invalid or expired share link");
  }

  if (shareLink.is_revoked) {
    throw new Error("This share link has been revoked");
  }

  // Check if expired
  const now = new Date();
  const expiry = new Date(shareLink.expiry);
  if (now > expiry) {
    throw new Error("This share link has expired");
  }

  // Calculate remaining time
  const hoursRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60));

  // Get filters
  const filters = shareLink.filters || {};

  // Get markup percentage from database column
  const markupPercentage = shareLink.markup_percentage || 0;

  // Build SQL WHERE clause - startIndex=2 because baseConditions has user_id=$1
  const { whereConditions, values, paramIndex } = buildStockFilters(filters, 2, [`user_id = $1`]);
  // Pass user_id as string (VARCHAR in database)
  values.unshift(shareLink.user_id);

  const whereClause = buildWhereClause(whereConditions);
  const { orderClause } = getSortConfig(filters);

  // Get total count
  const countResult = await stockRepo.query(
    `SELECT COUNT(*) as total FROM diamond_stock ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].total);

  // Pagination settings
  const page = parseInt(queryParams.page) || 1;
  const limit = Math.min(parseInt(queryParams.limit) || 50, 100);
  const offset = (page - 1) * limit;

  // Hide sensitive columns (pricing info) - but keep price_per_carat for markup calculation
  const hideColumns = ["user_id", "final_price", "dollar_rate", "rs_amount", "discount", "rap_per_carat"];
  const allColumns = stockRepo.ALL_COLUMNS || [];
  const publicColumns = allColumns.filter((col) => !hideColumns.includes(col));

  // Get paginated stock data
  const dataResult = await stockRepo.query(
    `SELECT ${publicColumns.join(", ")} FROM diamond_stock
     ${whereClause}
     ORDER BY ${orderClause}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...values, limit, offset]
  );

  // Apply markup/discount percentage to price_per_carat if provided
  let stocks = dataResult.rows;
  if (markupPercentage !== 0) {
    stocks = stocks.map((stock) => ({
      ...stock,
      price_per_carat: stock.price_per_carat
        ? Math.round(stock.price_per_carat * (1 + markupPercentage / 100) * 100) / 100
        : null,
    }));
  }

  const totalPages = Math.ceil(total / limit);

  return {
    stocks,
    pagination: { total, page, limit, totalPages },
    expiresIn: `${hoursRemaining} hours`,
    expiryTime: shareLink.expiry,
    filters: shareLink.filters,
    markupPercentage: shareLink.markup_percentage || 0,
  };
};

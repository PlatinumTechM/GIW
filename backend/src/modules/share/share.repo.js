import { pool } from "../../config/db.js";

// Save new share link to database
export const createShareLink = async (shareData) => {
  const { token, userId, markupPercentage, filters, expiry } = shareData;

  const result = await pool.query(
    `INSERT INTO share_links (token, user_id, markup_percentage, filters, expiry)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [token, userId, markupPercentage || 0, JSON.stringify(filters), expiry]
  );

  return result.rows[0];
};

// Find share link by token
export const getShareLinkByToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM share_links WHERE token = $1`,
    [token]
  );
  return result.rows[0] || null;
};

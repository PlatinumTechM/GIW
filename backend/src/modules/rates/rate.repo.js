import { pool } from "../../config/db.js";

export const rateRepo = {
  /**
   * Get the latest rate for a specific type
   * @param {string} type - 'usd', 'gold', or 'silver'
   * @returns {Promise<Object|null>}
   */
  async getLatestRate(type) {
    const query = `
      SELECT id, type, value, change_value, updated_at
      FROM rates
      WHERE type = $1
      ORDER BY updated_at DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [type]);
    return result.rows[0] || null;
  },

  /**
   * Get all latest rates
   * @returns {Promise<Array>}
   */
  async getAllLatestRates() {
    const query = `
      SELECT DISTINCT ON (type) id, type, value, change_value, updated_at
      FROM rates
      ORDER BY type, updated_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Get previous rate for calculating change
   * @param {string} type - 'usd', 'gold', or 'silver'
   * @returns {Promise<Object|null>}
   */
  async getPreviousRate(type) {
    const query = `
      SELECT value
      FROM rates
      WHERE type = $1
      ORDER BY updated_at DESC
      OFFSET 1
      LIMIT 1
    `;
    const result = await pool.query(query, [type]);
    return result.rows[0] || null;
  },

  /**
   * Insert a new rate record (deprecated - use upsertRate instead)
   * @param {Object} rateData
   * @param {string} rateData.type
   * @param {number} rateData.value
   * @param {number} rateData.change_value
   * @returns {Promise<Object>}
   */
  async createRate({ type, value, change_value }) {
    const query = `
      INSERT INTO rates (type, value, change_value, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, type, value, change_value, updated_at
    `;
    const result = await pool.query(query, [type, value, change_value]);
    return result.rows[0];
  },

  /**
   * Upsert rate - Update existing record or insert if not exists
   * Keeps only one record per type, updating it with new values
   * @param {Object} rateData
   * @param {string} rateData.type
   * @param {number} rateData.value
   * @param {number} rateData.change_value
   * @returns {Promise<Object>}
   */
  async upsertRate({ type, value, change_value }) {
    // First, try to update existing record
    const updateQuery = `
      UPDATE rates
      SET value = $1,
          change_value = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE type = $3
      RETURNING id, type, value, change_value, updated_at
    `;
    const updateResult = await pool.query(updateQuery, [
      value,
      change_value,
      type,
    ]);

    if (updateResult.rows.length > 0) {
      return updateResult.rows[0];
    }

    // If no record exists, insert new one
    const insertQuery = `
      INSERT INTO rates (type, value, change_value, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, type, value, change_value, updated_at
    `;
    const insertResult = await pool.query(insertQuery, [
      type,
      value,
      change_value,
    ]);
    return insertResult.rows[0];
  },

  /**
   * Get rate history for a specific type (optional pagination)
   * @param {string} type
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getRateHistory(type, limit = 24) {
    const query = `
      SELECT id, type, value, change_value, updated_at
      FROM rates
      WHERE type = $1
      ORDER BY updated_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [type, limit]);
    return result.rows;
  },

  /**
   * Clean up old rate records (keep only last 7 days)
   * @returns {Promise<number>} - Number of deleted records
   */
  async cleanupOldRates() {
    const query = `
      DELETE FROM rates
      WHERE updated_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
    `;
    const result = await pool.query(query);
    return result.rowCount;
  },
};

export default rateRepo;

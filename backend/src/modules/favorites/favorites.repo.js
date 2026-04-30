import { pool } from "../../config/db.js";

export const favoritesRepo = {
  addDiamondFavorite: async (userId, stockId) => {
    const sql = `
      INSERT INTO user_favorites (user_id, stock_id, item_type, created_at)
      VALUES ($1, $2, 'diamond', NOW())
      ON CONFLICT DO NOTHING
    `;
    await pool.query(sql, [userId, stockId]);
    return { success: true };
  },

  addJewelryFavorite: async (userId, jewelryId) => {
    const sql = `
      INSERT INTO user_favorites (user_id, jewellry_id, item_type, created_at)
      VALUES ($1, $2, 'jewelry', NOW())
      ON CONFLICT DO NOTHING
    `;
    await pool.query(sql, [userId, jewelryId]);
    return { success: true };
  },

  removeDiamondFavorite: async (userId, stockId) => {
    const sql = `
      DELETE FROM user_favorites
      WHERE user_id = $1 AND stock_id = $2 AND item_type = 'diamond'
    `;
    await pool.query(sql, [userId, stockId]);
    return { success: true };
  },

  removeJewelryFavorite: async (userId, jewelryId) => {
    const sql = `
      DELETE FROM user_favorites
      WHERE user_id = $1 AND jewellry_id = $2 AND item_type = 'jewelry'
    `;
    await pool.query(sql, [userId, jewelryId]);
    return { success: true };
  },

  isDiamondFavorite: async (userId, stockId) => {
    const sql = `
      SELECT COUNT(*) AS count
      FROM user_favorites
      WHERE user_id = $1 AND stock_id = $2 AND item_type = 'diamond'
    `;
    const result = await pool.query(sql, [userId, stockId]);
    return parseInt(result.rows[0].count) > 0;
  },

  isJewelryFavorite: async (userId, jewelryId) => {
    const sql = `
      SELECT COUNT(*) AS count
      FROM user_favorites
      WHERE user_id = $1 AND jewellry_id = $2 AND item_type = 'jewelry'
    `;
    const result = await pool.query(sql, [userId, jewelryId]);
    return parseInt(result.rows[0].count) > 0;
  },

  getFavoriteDiamonds: async (userId, page = 1, limit = 12) => {
    const offset = (page - 1) * limit;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM user_favorites
      WHERE user_id = $1 AND item_type = 'diamond'
    `;
    const countResult = await pool.query(countSql, [userId]);
    const totalCount = parseInt(countResult.rows[0].total);

    const sql = `
      SELECT
        s.*,
        uf.created_at AS favorited_at,
        uf.item_type,
        'DIAMOND' AS type,
        u.name AS seller_name,
        u.company AS seller_company
      FROM user_favorites uf
      JOIN diamond_stock s ON uf.stock_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE uf.user_id = $1
        AND uf.item_type = 'diamond'
        AND s.status <> 'DELETED'
      ORDER BY uf.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const stocksResult = await pool.query(sql, [
      userId,
      parseInt(limit),
      parseInt(offset),
    ]);

    return {
      items: stocksResult.rows,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    };
  },

  getFavoriteJewelry: async (userId, page = 1, limit = 12) => {
    const offset = (page - 1) * limit;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM user_favorites
      WHERE user_id = $1 AND item_type = 'jewelry'
    `;
    const countResult = await pool.query(countSql, [userId]);
    const totalCount = parseInt(countResult.rows[0].total);

    const sql = `
      SELECT
        j.*,
        uf.created_at AS favorited_at,
        uf.item_type,
        'JEWELRY' AS type,
        u.name AS seller_name,
        u.company AS seller_company
      FROM user_favorites uf
      JOIN jewellery_stock j ON uf.jewellry_id = j.id
      LEFT JOIN users u ON j.user_id = u.id
      WHERE uf.user_id = $1
        AND uf.item_type = 'jewelry'
        AND j.status <> 'DELETED'
      ORDER BY uf.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const jewelryResult = await pool.query(sql, [
      userId,
      parseInt(limit),
      parseInt(offset),
    ]);

    return {
      items: jewelryResult.rows,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    };
  },

  getAllFavorites: async (userId, page = 1, limit = 12) => {
    const offset = (page - 1) * limit;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM user_favorites
      WHERE user_id = $1
    `;
    const countResult = await pool.query(countSql, [userId]);
    const totalCount = parseInt(countResult.rows[0].total);

    const diamondsSql = `
      SELECT
        s.*,
        uf.created_at AS favorited_at,
        uf.item_type,
        'DIAMOND' AS type,
        u.name AS seller_name,
        u.company AS seller_company
      FROM user_favorites uf
      JOIN diamond_stock s ON uf.stock_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE uf.user_id = $1
        AND uf.item_type = 'diamond'
        AND s.status <> 'DELETED'
    `;

    const jewelrySql = `
      SELECT
        j.*,
        uf.created_at AS favorited_at,
        uf.item_type,
        'JEWELRY' AS type,
        u.name AS seller_name,
        u.company AS seller_company
      FROM user_favorites uf
      JOIN jewellery_stock j ON uf.jewellry_id = j.id
      LEFT JOIN users u ON j.user_id = u.id
      WHERE uf.user_id = $1
        AND uf.item_type = 'jewelry'
        AND j.status <> 'DELETED'
    `;

    const [diamondsResult, jewelriesResult] = await Promise.all([
      pool.query(diamondsSql, [userId]),
      pool.query(jewelrySql, [userId]),
    ]);

    const allFavorites = [...diamondsResult.rows, ...jewelriesResult.rows].sort(
      (a, b) => new Date(b.favorited_at) - new Date(a.favorited_at)
    );

    const paginatedItems = allFavorites.slice(offset, offset + parseInt(limit));

    return {
      items: paginatedItems,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    };
  },

  getFavoriteCounts: async (userId) => {
    const sql = `
      SELECT item_type, COUNT(*) AS count
      FROM user_favorites
      WHERE user_id = $1
      GROUP BY item_type
    `;
    const results = await pool.query(sql, [userId]);

    const counts = { diamond: 0, jewelry: 0, DIAMOND: 0, JEWELRY: 0, total: 0 };

    results.rows.forEach((row) => {
      const type = row.item_type?.toLowerCase();
      const count = parseInt(row.count);

      if (type === "diamond") {
        counts.diamond = count;
        counts.DIAMOND = count;
      }

      if (type === "jewelry") {
        counts.jewelry = count;
        counts.JEWELRY = count;
      }

      counts.total += count;
    });

    return counts;
  },

  toggleDiamondFavorite: async (userId, stockId) => {
    const isFav = await favoritesRepo.isDiamondFavorite(userId, stockId);

    if (isFav) {
      await favoritesRepo.removeDiamondFavorite(userId, stockId);
      return { isFavorite: false };
    }

    await favoritesRepo.addDiamondFavorite(userId, stockId);
    return { isFavorite: true };
  },

  toggleJewelryFavorite: async (userId, jewelryId) => {
    const isFav = await favoritesRepo.isJewelryFavorite(userId, jewelryId);

    if (isFav) {
      await favoritesRepo.removeJewelryFavorite(userId, jewelryId);
      return { isFavorite: false };
    }

    await favoritesRepo.addJewelryFavorite(userId, jewelryId);
    return { isFavorite: true };
  },

  clearAllFavorites: async (userId) => {
    const sql = `DELETE FROM user_favorites WHERE user_id = $1`;
    await pool.query(sql, [userId]);
    return { success: true };
  },

  getBulkDiamondFavoriteStatus: async (userId, stockIds) => {
    if (!stockIds || stockIds.length === 0) return {};

    const placeholders = stockIds.map((_, i) => `$${i + 2}`).join(",");
    const sql = `
      SELECT stock_id
      FROM user_favorites
      WHERE user_id = $1
        AND item_type = 'diamond'
        AND stock_id IN (${placeholders})
    `;
    const results = await pool.query(sql, [userId, ...stockIds]);

    const favSet = new Set(results.rows.map((r) => String(r.stock_id)));
    const statusMap = {};

    stockIds.forEach((id) => {
      statusMap[id] = favSet.has(String(id));
    });

    return statusMap;
  },

  getBulkJewelryFavoriteStatus: async (userId, jewelryIds) => {
    if (!jewelryIds || jewelryIds.length === 0) return {};

    const placeholders = jewelryIds.map((_, i) => `$${i + 2}`).join(",");
    const sql = `
      SELECT jewellry_id
      FROM user_favorites
      WHERE user_id = $1
        AND item_type = 'jewelry'
        AND jewellry_id IN (${placeholders})
    `;
    const results = await pool.query(sql, [userId, ...jewelryIds]);

    const favSet = new Set(results.rows.map((r) => String(r.jewellry_id)));
    const statusMap = {};

    jewelryIds.forEach((id) => {
      statusMap[id] = favSet.has(String(id));
    });

    return statusMap;
  },
};
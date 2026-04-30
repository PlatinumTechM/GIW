import { rateService } from "./rate.service.js";

export const rateController = {
  /**
   * GET /api/v1/rates
   * Get current rates for all types
   */
  async getRates(req, res, next) {
    try {
      const rates = await rateService.getCurrentRates();

      // Check if data is stale (older than 1 hour)
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const response = {
        success: true,
        data: {
          usd: rates.usd
            ? {
                ...rates.usd,
                isStale: new Date(rates.usd.updated_at) < oneHourAgo,
              }
            : null,
          gold: rates.gold
            ? {
                ...rates.gold,
                isStale: new Date(rates.gold.updated_at) < oneHourAgo,
              }
            : null,
          silver: rates.silver
            ? {
                ...rates.silver,
                isStale: new Date(rates.silver.updated_at) < oneHourAgo,
              }
            : null,
        },
        message: "Rates fetched successfully",
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/rates/history/:type
   * Get rate history for a specific type
   */
  async getRateHistory(req, res, next) {
    try {
      const { type } = req.params;
      const limit = parseInt(req.query.limit) || 24;

      // Validate type
      const validTypes = ["usd", "gold", "silver"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid rate type. Must be 'usd', 'gold', or 'silver'",
          data: null,
        });
      }

      const history = await rateService.getRateHistory(type, limit);

      res.json({
        success: true,
        data: history,
        message: `${type.toUpperCase()} rate history fetched successfully`,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/rates/refresh
   * Manual refresh of rates (admin only)
   */
  async manualRefresh(req, res, next) {
    try {
      // Note: Add admin authentication middleware to this route
      const results = await rateService.manualRefresh();

      res.json({
        success: true,
        data: results,
        message: "Rates refreshed successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/rates/:type
   * Get specific rate type
   */
  async getRateByType(req, res, next) {
    try {
      const { type } = req.params;

      // Validate type
      const validTypes = ["usd", "gold", "silver"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid rate type. Must be 'usd', 'gold', or 'silver'",
          data: null,
        });
      }

      const rates = await rateService.getCurrentRates();
      const rate = rates[type];

      if (!rate) {
        return res.status(404).json({
          success: false,
          message: `No ${type} rate data available`,
          data: null,
        });
      }

      // Check if data is stale
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      res.json({
        success: true,
        data: {
          ...rate,
          isStale: new Date(rate.updated_at) < oneHourAgo,
        },
        message: `${type.toUpperCase()} rate fetched successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default rateController;

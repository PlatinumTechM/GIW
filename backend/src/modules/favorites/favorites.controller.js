import { favoritesService } from "./favorites.service.js";

export const favoritesController = {
  // Toggle diamond favorite (add/remove)
  toggleDiamondFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { stockId } = req.params;
      
      const result = await favoritesService.toggleDiamondFavorite(userId, stockId);
      
      res.status(200).json({
        success: true,
        data: result,
        message: result.isFavorite 
          ? "Added to favorites" 
          : "Removed from favorites"
      });
    } catch (error) {
      next(error);
    }
  },

  // Toggle jewelry favorite (add/remove)
  toggleJewelryFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { jewelryId } = req.params;
      
      const result = await favoritesService.toggleJewelryFavorite(userId, jewelryId);
      
      res.status(200).json({
        success: true,
        data: result,
        message: result.isFavorite 
          ? "Added to favorites" 
          : "Removed from favorites"
      });
    } catch (error) {
      next(error);
    }
  },

  // Check diamond favorite status
  checkDiamondFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { stockId } = req.params;
      
      const result = await favoritesService.checkDiamondFavorite(userId, stockId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Check jewelry favorite status
  checkJewelryFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { jewelryId } = req.params;
      
      const result = await favoritesService.checkJewelryFavorite(userId, jewelryId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Get favorite diamonds
  getFavoriteDiamonds: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      
      const result = await favoritesService.getFavoriteDiamonds(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Get favorite jewelry
  getFavoriteJewelry: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      
      const result = await favoritesService.getFavoriteJewelry(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all favorites (combined)
  getAllFavorites: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const type = req.query.type; // 'diamond', 'jewelry', or undefined for all
      
      let result;
      if (type === 'diamond') {
        result = await favoritesService.getFavoriteDiamonds(userId, page, limit);
      } else if (type === 'jewelry') {
        result = await favoritesService.getFavoriteJewelry(userId, page, limit);
      } else {
        result = await favoritesService.getAllFavorites(userId, page, limit);
      }
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Get favorite counts
  getFavoriteCounts: async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      const result = await favoritesService.getFavoriteCounts(userId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Clear all favorites
  clearAllFavorites: async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      await favoritesService.clearAllFavorites(userId);
      
      res.status(200).json({
        success: true,
        message: "All favorites cleared"
      });
    } catch (error) {
      next(error);
    }
  },

  // Get bulk favorite status for diamonds
  getBulkDiamondFavoriteStatus: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { ids } = req.body; // Array of stock IDs
      
      if (!Array.isArray(ids)) {
        return res.status(400).json({
          success: false,
          error: "ids must be an array"
        });
      }
      
      const result = await favoritesService.getBulkDiamondFavoriteStatus(userId, ids);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Get bulk favorite status for jewelry
  getBulkJewelryFavoriteStatus: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { ids } = req.body; // Array of jewelry IDs
      
      if (!Array.isArray(ids)) {
        return res.status(400).json({
          success: false,
          error: "ids must be an array"
        });
      }
      
      const result = await favoritesService.getBulkJewelryFavoriteStatus(userId, ids);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
};

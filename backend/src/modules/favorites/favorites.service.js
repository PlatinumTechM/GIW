import { favoritesRepo } from "./favorites.repo.js";

export const favoritesService = {
  // Add diamond to favorites
  addDiamondFavorite: async (userId, stockId) => {
    if (!stockId) {
      throw new Error("Stock ID is required");
    }
    return await favoritesRepo.addDiamondFavorite(userId, stockId);
  },

  // Add jewelry to favorites
  addJewelryFavorite: async (userId, jewelryId) => {
    if (!jewelryId) {
      throw new Error("Jewelry ID is required");
    }
    return await favoritesRepo.addJewelryFavorite(userId, jewelryId);
  },

  // Remove diamond from favorites
  removeDiamondFavorite: async (userId, stockId) => {
    return await favoritesRepo.removeDiamondFavorite(userId, stockId);
  },

  // Remove jewelry from favorites
  removeJewelryFavorite: async (userId, jewelryId) => {
    return await favoritesRepo.removeJewelryFavorite(userId, jewelryId);
  },

  // Check if item is favorite
  checkDiamondFavorite: async (userId, stockId) => {
    const isFavorite = await favoritesRepo.isDiamondFavorite(userId, stockId);
    return { isFavorite };
  },

  checkJewelryFavorite: async (userId, jewelryId) => {
    const isFavorite = await favoritesRepo.isJewelryFavorite(userId, jewelryId);
    return { isFavorite };
  },

  // Get favorite diamonds
  getFavoriteDiamonds: async (userId, page, limit) => {
    return await favoritesRepo.getFavoriteDiamonds(userId, page, limit);
  },

  // Get favorite jewelry
  getFavoriteJewelry: async (userId, page, limit) => {
    return await favoritesRepo.getFavoriteJewelry(userId, page, limit);
  },

  // Get all favorites
  getAllFavorites: async (userId, page, limit) => {
    return await favoritesRepo.getAllFavorites(userId, page, limit);
  },

  // Get favorite counts
  getFavoriteCounts: async (userId) => {
    return await favoritesRepo.getFavoriteCounts(userId);
  },

  // Toggle favorite status
  toggleDiamondFavorite: async (userId, stockId) => {
    return await favoritesRepo.toggleDiamondFavorite(userId, stockId);
  },

  toggleJewelryFavorite: async (userId, jewelryId) => {
    return await favoritesRepo.toggleJewelryFavorite(userId, jewelryId);
  },

  // Clear all favorites
  clearAllFavorites: async (userId) => {
    return await favoritesRepo.clearAllFavorites(userId);
  },

  // Get bulk favorite status
  getBulkDiamondFavoriteStatus: async (userId, stockIds) => {
    return await favoritesRepo.getBulkDiamondFavoriteStatus(userId, stockIds);
  },

  getBulkJewelryFavoriteStatus: async (userId, jewelryIds) => {
    return await favoritesRepo.getBulkJewelryFavoriteStatus(userId, jewelryIds);
  },
};

import express from "express";
import { favoritesController } from "./favorites.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", favoritesController.getAllFavorites);
router.get("/counts", favoritesController.getFavoriteCounts);

router.get("/diamonds", favoritesController.getFavoriteDiamonds);
router.get("/jewelry", favoritesController.getFavoriteJewelry);

// Bulk route MUST be before :stockId / :jewelryId
router.post("/diamonds/bulk-status", favoritesController.getBulkDiamondFavoriteStatus);
router.post("/jewelry/bulk-status", favoritesController.getBulkJewelryFavoriteStatus);

router.post("/diamonds/:stockId", favoritesController.toggleDiamondFavorite);
router.post("/jewelry/:jewelryId", favoritesController.toggleJewelryFavorite);

router.get("/diamonds/:stockId/status", favoritesController.checkDiamondFavorite);
router.get("/jewelry/:jewelryId/status", favoritesController.checkJewelryFavorite);

router.delete("/clear", favoritesController.clearAllFavorites);

export { router as favoritesRoutes };
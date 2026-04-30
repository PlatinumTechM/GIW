import express from "express";
import { rateController } from "./rate.controller.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = express.Router();

// Public routes - rates are viewable by everyone
router.get("/", rateController.getRates);
router.get("/history/:type", rateController.getRateHistory);
router.get("/:type", rateController.getRateByType);

// Protected routes - require authentication
// Manual refresh endpoint (should also check for admin role in production)
router.post("/refresh", authenticateToken, rateController.manualRefresh);

export { router as rateRoutes };
export default router;

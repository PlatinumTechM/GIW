import express from "express";
import * as shareApiController from "./share-api.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { authenticateHeader } from "../../../middleware/authenticateHeader.middleware.js";

const router = express.Router();

router.post("/create", authenticate, shareApiController.createApiKey);
router.get("/my", authenticate, shareApiController.getMyApiKeys);
router.patch("/:id/status", authenticate, shareApiController.toggleApiKeyStatus);

// Public route to fetch stock via API token (uses authenticateHeader middleware)
router.get("/stock", authenticateHeader, shareApiController.getStockByToken);

export default router;

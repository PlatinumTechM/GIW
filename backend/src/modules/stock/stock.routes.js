import express from "express";

import * as stockController from "./stock.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Bulk upload stock from CSV/Excel

router.post("/bulk", authenticate, stockController.bulkUpload);

// Get all stocks with filtering and pagination

router.get("/", authenticate, stockController.getAllStocks);

// Get current user's stocks

router.get("/my", authenticate, stockController.getMyStocks);

// Get single stock by id

router.get("/:id", authenticate, stockController.getStockById);

// Create single stock

router.post("/", authenticate, stockController.createStock);

// Update stock

router.put("/:id", authenticate, stockController.updateStock);

// Delete stock

router.delete("/:id", authenticate, stockController.deleteStock);

// Get field mapping info

router.get("/fields/mapping", authenticate, stockController.getFieldMapping);

export { router as stockRoutes };

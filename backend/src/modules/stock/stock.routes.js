import express from "express";

import * as stockController from "./stock.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// NaturalDiamond stocks route
router.get("/natural", authenticate, (req, res) => {
  req.query.type = "NATURAL";
  return stockController.getAllStocks(req, res);
});

// LabGrownDiamond stocks route
router.get("/lab-grown", authenticate, (req, res) => {
  req.query.type = "LAB_GROWN";
  return stockController.getAllStocks(req, res);
});

// Bulk upload stock from CSV/Excel

router.post("/bulk", authenticate, stockController.bulkUpload);

// Get all stocks with filtering and pagination

router.get("/", authenticate, stockController.getAllStocks);

// Get current user's stocks

router.get("/my", authenticate, stockController.getMyStocks);

// Get unique filter options (shapes, colors, clarities) - MUST be before /:id

router.get("/filters", authenticate, stockController.getFilterOptions);

// Get field mapping info

router.get("/fields/mapping", authenticate, stockController.getFieldMapping);

// Get single stock by id - MUST be after all specific routes

router.get("/:id", authenticate, stockController.getStockById);

// Create single stock

router.post("/", authenticate, stockController.createStock);

// Update stock

router.put("/:id", authenticate, stockController.updateStock);

// Delete stock

router.delete("/:id", authenticate, stockController.deleteStock);

export { router as stockRoutes };

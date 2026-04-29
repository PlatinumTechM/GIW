import express from "express";
import * as jewellryController from "./jewellry.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Public storefront routes (no auth) - similar to diamond stock routes
router.get("/natural", jewellryController.getAllNaturalPublic);
router.get("/lab-grown", jewellryController.getAllLabGrownPublic);
router.get("/public/filters", jewellryController.getFiltersPublic);
router.get("/public/:id", jewellryController.getByIdPublic);

// Admin/Manufacturer authenticated routes
router.get("/", authenticate, jewellryController.getAll);
router.get("/filters", authenticate, jewellryController.getFilters);
router.post("/bulk-upload", authenticate, jewellryController.bulkUpload);
router.get("/:id", authenticate, jewellryController.getById);
router.post("/", authenticate, jewellryController.create);
router.put("/:id", authenticate, jewellryController.update);
router.delete("/:id", authenticate, jewellryController.remove);

export { router as jewellryRoutes };

import express from "express";
import { adminController } from "./admin.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Verify admin password
router.post("/verify-password", authenticate, adminController.verifyAdminPassword);
router.get("/users", authenticate, adminController.getAllUsers);
export { router as adminRoutes };
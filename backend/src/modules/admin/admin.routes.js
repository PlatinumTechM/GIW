import express from "express";
import { adminController } from "./admin.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Verify admin password
router.post(
  "/verify-password",
  authenticate,
  adminController.verifyAdminPassword,
);
router.get("/users", authenticate, adminController.getAllUsers);

// Public subscription endpoint (no auth required)
router.get("/subscriptions/public", adminController.getSubscriptions);

// Subscription management routes (admin only)
router.get("/subscriptions", authenticate, adminController.getSubscriptions);
router.post("/subscriptions", authenticate, adminController.createSubscription);
router.put(
  "/subscriptions/:id",
  authenticate,
  adminController.updateSubscription,
);
router.delete(
  "/subscriptions/:id",
  authenticate,
  adminController.deleteSubscription,
);

export { router as adminRoutes };

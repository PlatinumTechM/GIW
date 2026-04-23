import express from "express";
import * as adminController from "./admin.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Verify admin password
router.post(
  "/verify-password",
  authenticate,
  adminController.verifyAdminPassword,
);
router.get("/users", authenticate, adminController.getAllUsers);

// Public subscription endpoint (no auth required) - returns only active subscriptions
router.get("/subscriptions/public", adminController.getActiveSubscriptions);

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

// Get all subscription buyers
router.get("/subscription-buyers", authenticate, adminController.getSubscriptionBuyers);

// Update user plan (admin only)
router.put("/users/:userId/plan", authenticate, adminController.updateUserPlan);

export { router as adminRoutes };
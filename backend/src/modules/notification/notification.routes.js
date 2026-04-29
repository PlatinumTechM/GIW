import express from "express";
import * as notificationController from "./notification.controller.js";
import { validateCreateNotification, validateUpdateNotification } from "./notification.validate.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { notificationUpload } from "../../middleware/upload.middleware.js";

const router = express.Router();

// All routes are protected with authentication
router.get("/", authenticate, notificationController.getAllNotifications);
router.post("/", authenticate, notificationUpload.single('image'), validateCreateNotification, notificationController.createNotification);
router.get("/users", authenticate, notificationController.getAllUsersForNotification);
router.get("/unread-count", authenticate, notificationController.getUnreadCount);
router.get("/:id", authenticate, notificationController.getNotificationById);
router.put("/:id", authenticate, notificationUpload.single('image'), validateUpdateNotification, notificationController.updateNotification);
router.delete("/:id", authenticate, notificationController.deleteNotification);
router.patch("/:id/read", authenticate, notificationController.markAsRead);
router.patch("/mark-all-read", authenticate, notificationController.markAllAsRead);

export { router as notificationRoutes };

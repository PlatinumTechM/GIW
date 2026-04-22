import express from "express";
import { authController } from "./auth.controller.js";
import { validateLogin, validateRegister } from "./auth.validate.js";
import { upload } from "../../middleware/upload.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", validateLogin, authController.login);
router.post(
  "/register",
  upload.single("upload"),
  validateRegister,
  authController.register,
);
router.get("/me", authenticate, authController.getCurrentUser);
router.put("/profile", authenticate, authController.updateProfile);
router.post("/logout", authenticate, authController.logout);
router.post("/purchase-subscription", authenticate, authController.purchaseSubscription);

export { router as authRoutes };

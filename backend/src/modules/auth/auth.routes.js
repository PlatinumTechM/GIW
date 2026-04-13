import express from "express";
import { AuthController } from "./auth.controller.js";
import { validateLogin, validateRegister } from "./auth.validate.js";

const router = express.Router();
const authController = new AuthController();

router.post("/login", validateLogin, authController.login.bind(authController));
router.post(
  "/register",
  validateRegister,
  authController.register.bind(authController),
);

export { router as authRoutes };

import express from "express";
import * as shareController from "./share.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Create share link (need login)
router.post("/create", authenticate, shareController.createShareLink);

// View shared stock (no login needed - public link)
router.get("/data/:token", shareController.getSharedData);

export { router as shareRoutes };

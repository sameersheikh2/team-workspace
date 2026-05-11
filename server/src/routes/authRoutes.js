import express from "express";
import asyncWrapper from "../utils/asyncHandler.js";
import authController from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", asyncWrapper(authController.register));
router.post("/login", asyncWrapper(authController.login));
router.post("/logout", auth, asyncWrapper(authController.logout));
router.get("/refresh", asyncWrapper(authController.refresh));

export default router;

import express from "express";
import asyncWrapper from "../utils/asyncHandler.js";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", asyncWrapper(authController.register));
router.post("/login", asyncWrapper(authController.login));

export default router;

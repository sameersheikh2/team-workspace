import express from "express";
import asyncWrapper from "../utils/asyncHandler.js";
import WorkspaceController from "../controllers/workspaceController.js";
import { auth } from "../middleware/auth.js";
const route = express.Router();

route.post("/", auth, asyncWrapper(WorkspaceController.createWorkspace));
route.get("/", auth, asyncWrapper(WorkspaceController.getWorkspaces));
route.get("/:id", auth, asyncWrapper(WorkspaceController.getWorkspaceDetail));

export default route;

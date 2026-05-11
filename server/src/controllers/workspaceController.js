import { successResponse } from "../middleware/apiResponse.js";
import workspaceService from "../services/workspaceService.js";

class WorkspaceController {
  async createWorkspace(req, res) {
    const workspace = await workspaceService.createWorkspace(
      req.body.name,
      req.user.id,
    );
    return successResponse(
      res,
      workspace,
      "Workspace created successfully",
      201,
    );
  }

  async getWorkspaces(req, res) {
    const allWorkspace = await workspaceService.getUserWorkspaces(req.user.id);
    return successResponse(res, allWorkspace, "Success", 200);
  }

  async getWorkspaceDetail(req, res) {
    // console.log(req.params);
    
    const workspace = await workspaceService.getWorkspaceDetail(
      req.params?.id,
      req.user.id,
    );
    return successResponse(res, workspace, "Success", 200);
  }

  async updateWorkspaceMember(req, res) {
    const data = await workspaceService.addMember(
      req.params?.id,
      req.user?.id,
      req.body?.memberId,
      req.body?.role,
    );
    return successResponse(res, data, "Member added successfully", 200);
  }
}

export default new WorkspaceController();

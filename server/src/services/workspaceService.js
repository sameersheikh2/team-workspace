import workspaceRepo from "../repository/workspaceRepository.js";
import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/globalError.js";

class WorkspaceService {
  async createWorkspace(name, ownerId) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new ValidationError("Workspace name is required", {
        name: "Workspace name cannot be empty",
      });
    }

    if (name.trim().length < 3) {
      throw new ValidationError("Workspace name too short", {
        name: "Workspace name must be at least 3 characters",
      });
    }

    const workspace = await workspaceRepo.create({
      name: name.trim(),
      owner: ownerId,
      members: [
        {
          user: ownerId,
          role: "owner",
        },
      ],
    });

    return workspace;
  }

  async getUserWorkspaces(userId) {
    if (!userId) {
      throw new ValidationError("User ID is required", {
        userId: "Valid user ID is required",
      });
    }

    const workspaces = await workspaceRepo.findAllByUser(userId);

    if (!workspaces || workspaces.length === 0) {
      throw new NotFoundError("Workspace");
    }

    return workspaces;
  }

  async getWorkspaceDetail(workspaceId, userId) {
    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required", {
        workspaceId: "Valid workspace ID is required",
      });
    }

    if (!userId) {
      throw new ValidationError("User ID is required", {
        userId: "Valid user ID is required",
      });
    }

    const workspace = await workspaceRepo.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundError("Workspace");
    }

    // Check if user is a member of this workspace
    const isMember = workspace.members?.find(
      (m) => m.user.toString() === userId.toString(),
    );

    if (!isMember) {
      throw new AuthorizationError(
        "Access denied. You are not a member of this workspace.",
      );
    }

    return workspace;
  }

  async addMember(workspaceId, currentUserId, newMemberId, role = "member") {
    // Validate inputs
    if (!workspaceId) {
      throw new ValidationError("Workspace ID is required", {
        workspaceId: "Valid workspace ID is required",
      });
    }

    if (!currentUserId) {
      throw new ValidationError("Current user ID is required", {
        currentUserId: "Valid current user ID is required",
      });
    }

    if (!newMemberId) {
      throw new ValidationError("New member ID is required", {
        newMemberId: "Valid new member ID is required",
      });
    }

    if (!["owner", "admin", "member"].includes(role)) {
      throw new ValidationError("Invalid role", {
        role: "Role must be one of: owner, admin, member",
      });
    }

    // Check if workspace exists
    const workspace = await workspaceRepo.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundError("Workspace");
    }

    // Check if current user is a member and has permission
    const currentMember = workspace.members.find(
      (m) => m.user.toString() === currentUserId.toString(),
    );

    if (!currentMember) {
      throw new AuthorizationError("You are not a member of this workspace");
    }

    if (!["owner", "admin"].includes(currentMember.role)) {
      throw new AuthorizationError(
        "You don't have permission to add members to this workspace",
      );
    }

    // Check if new member is already in the workspace
    const alreadyExists = workspace.members.some(
      (m) => m.user.toString() === newMemberId.toString(),
    );

    if (alreadyExists) {
      throw new ConflictError("User is already a member of this workspace");
    }

    // Check if trying to add owner role when not owner
    if (role === "owner" && currentMember.role !== "owner") {
      throw new AuthorizationError(
        "Only workspace owners can assign owner role",
      );
    }

    // Add the member
    const updatedWorkspace = await workspaceRepo.addMember(
      workspaceId,
      newMemberId,
      role,
    );

    if (!updatedWorkspace) {
      throw new ConflictError(
        "Failed to add member. User might already be a member.",
      );
    }

    return updatedWorkspace;
  }
}

export default new WorkspaceService();

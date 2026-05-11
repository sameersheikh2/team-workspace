import Workspace from "../models/Workspace.js";

class WorkspaceRepository {
  create(workspace) {
    return Workspace.create(workspace);
  }

  findAllByUser(userId) {
    return Workspace.find({
      "members.user": userId,
      isDeleted: false,
    });
  }

  findById(workspaceId) {
    return Workspace.findOne({ _id: workspaceId, isDeleted: false });
  }

  addMember(workspaceId, userId, role = "member") {
    return Workspace.findOneAndUpdate(
      {
        _id: workspaceId,
        isDeleted: false,
        "members.user": { $ne: userId },
      },
      {
        $push: {
          members: {
            user: userId,
            role,
          },
        },
      },
      { new: true },
    );
  }
}

export default new WorkspaceRepository();

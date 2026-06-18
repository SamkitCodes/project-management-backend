import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Project } from "../models/project.models.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ProjectMember } from "../models/projectmembers.models.js";
import { UserRolesEnum } from "../utils/constants.js";

const getAllProjects = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projectDetails",
      },
    },
    {
      $unwind: "$projectDetails",
    },
    {
      $lookup: {
        from: "projectmembers",
        localField: "projectDetails._id",
        foreignField: "project",
        as: "members",
      },
    },
    {
      $project: {
        _id: "$projectDetails._id",
        name: "$projectDetails.name",
        description: "$projectDetails.description",
        owner: "$projectDetails.owner",
        createdAt: "$projectDetails.createdAt",
        role: 1,
        membersCount: { $size: "$members" },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  const project = await Project.create({
    name,
    description,
    owner: new mongoose.Types.ObjectId(userId),
  });

  if (!project) {
    throw new ApiError(500, "Failed to create project");
  }

  const projectMember = await ProjectMember.create({
    project: new mongoose.Types.ObjectId(project._id),
    user: new mongoose.Types.ObjectId(userId),
    role: UserRolesEnum.ADMIN,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Project created successfully", project));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  const projectId = req.params.id;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, project, "Project updated successfully", project),
    );
});

const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Project deleted successfully", project));
});

const getProjectById = asyncHandler(async (req, res) => {
  const projectId = req.params.id;

  const project = await Project.findById(projectId).populate(
    "owner",
    "name email",
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const role = req.body.role || UserRolesEnum.MEMBER;
  const projectId = req.params.id;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const projectMember = await ProjectMember.create({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(user._id),
    role,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Member added to project successfully",
      ),
    );
});

const getMembersProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;

  const members = await ProjectMember.find({ project: projectId }).populate(
    "user",
    "name email",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, members, "Project members fetched successfully"),
    );
});

const updateProjectMemberRole = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { role } = req.body;

  if (!AvailableUserRole.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const projectMember = await ProjectMember.findOneAndUpdate(
    { project: projectId, user: memberId },
    { role: role },
    { new: true },
  );

  if (!projectMember) {
    throw new ApiError(404, "Project member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Project member role updated successfully",
      ),
    );
});

const removeProjectMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  const projectMember = await ProjectMember.findOneAndDelete({
    project: projectId,
    user: memberId,
  });

  if (!projectMember) {
    throw new ApiError(404, "Project member not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Project member removed successfully",
      ),
    );
});

export {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMembersToProject,
  getMembersProject,
  updateProjectMemberRole,
  removeProjectMember,
};

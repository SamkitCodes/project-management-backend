import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import { ProjectMember } from "../models/projectmembers.models.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized: Access token is missing");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized: Invalid or expired access token");
  }
});

const verifyProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const projectId = req.params.projectId;

    if (!projectId) {
      throw new ApiError(400, "Bad Request: Project ID is required");
    }

    const projectMember = await ProjectMember.findOne({
      user: new mongoose.Types.ObjectId(userId),
      project: new mongoose.Types.ObjectId(projectId),
    });

    if (!projectMember) {
      throw new ApiError(
        403,
        "Forbidden: You are not a member of this project",
      );
    }

    const userRole = projectMember.role;

    req.userRole = userRole;

    if (!roles.includes(userRole)) {
      throw new ApiError(
        403,
        "Forbidden: You do not have permission to perform this action",
      );
    }

    next();
  });
};

export { verifyJWT, verifyProjectPermission };

import { body } from "express-validator";
import { validate } from "../middlewares/validator.middleware.js";

const userRegisterValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long")
      .isLowercase()
      .withMessage("Username must be in lowercase"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    validate,
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .optional()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("username")
      .optional()
      .isLowercase()
      .withMessage("Username must be in lowercase"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ];
};

const userChangePasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    validate,
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    validate,
  ];
};

const userResetPasswordValidator = () => {
  return [
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    validate,
  ];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Project name is required"),
    body("description")
      .notEmpty()
      .withMessage("Project description is required"),
    validate,
  ];
};

const addProjectMemberValidator = () => {
  return [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["owner", "admin", "member"])
      .withMessage("Invalid role"),
    validate,
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangePasswordValidator,
  userForgotPasswordValidator,
  userResetPasswordValidator,
  createProjectValidator,
  addProjectMemberValidator,
};

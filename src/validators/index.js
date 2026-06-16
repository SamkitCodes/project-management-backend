import { body } from "express-validator"; // 👈 Added this missing import
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

export { userRegisterValidator, userLoginValidator };

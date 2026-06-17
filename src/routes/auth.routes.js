import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  verifyEmail,
  refershToken,
  forgotPassword,
  resetPassword,
  changePassword,
  resendEmailVerification,
} from "../contollers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userRegisterValidator(), validate, loginUser);

//Secure route, only for testing the verifyJWT middleware
router.use(verifyJWT);
router.route("/logout").post(logoutUser);
router.route("/getCurrentUser").get(currentUser);
router.route("/change-password").post(changePassword);
router.route("/refresh-token").post(refershToken);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").post(resetPassword);
router.route("/resend-email-verification").post(resendEmailVerification);

export default router;

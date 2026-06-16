import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
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

export default router;

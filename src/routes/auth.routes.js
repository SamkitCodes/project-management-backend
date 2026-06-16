import { Router } from "express";
import { registerUser, loginUser } from "../contollers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";

import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userRegisterValidator(), validate, loginUser);

export default router;

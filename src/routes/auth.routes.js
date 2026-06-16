import { Router } from "express";
import { registerUser, loginUser } from "../contollers/auth.controller.js";
import { validateRequest } from "../middlewares/validator.middleware.js";

import { userRegisterValidator } from "../validators/index.js";

const router = Router();

router
  .route("/register")
  .post(userRegisterValidator(), validateRequest, registerUser);

router.route("/login").post(loginUser);

export default router;

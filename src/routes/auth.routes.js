import { Router } from "express";
import { registerUser } from "../contollers/auth.controller.js";
import { validateRequest } from "../middlewares/validator.middleware.js";

import { userRegisterValidator } from "../validators/index.js";

const router = Router();

router
  .route("/register")
  .post(userRegisterValidator(), validateRequest, registerUser);

export default router;

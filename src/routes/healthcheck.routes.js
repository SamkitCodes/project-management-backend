import { Router } from "express";
import { healthCheck } from "../contollers/healthcheck.controllers.js";

const router = Router();

router.route("/").get(healthCheck);

export default router;

import { Router } from "express";
const router = Router();

import * as lifecycleController from "../controllers/lifecycle-controller";
import authenticationMiddleware from "../middlewares/authentication";

router.post("/sync", authenticationMiddleware, lifecycleController.handleSync);

router.post(
  "/async",
  authenticationMiddleware,
  lifecycleController.handleAsync
);

export default router;

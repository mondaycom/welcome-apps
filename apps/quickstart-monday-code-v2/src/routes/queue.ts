import { Router } from "express";
import { produce, consumeQueue, cronjobTest } from "../controllers/queue.controller.js";

export const queueRoutes = Router();

queueRoutes.post("/produce", produce);
queueRoutes.post("/mndy-queue", consumeQueue);
queueRoutes.post("/mndy-cronjob/test", cronjobTest);

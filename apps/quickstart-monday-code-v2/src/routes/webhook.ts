import { Router } from "express";
import { omdbWebhook } from "../controllers/webhook.controller.js";

export const webhookRoutes = Router();

webhookRoutes.post("/omdb-webhook", omdbWebhook);

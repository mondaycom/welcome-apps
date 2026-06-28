import { Router } from "express";
import { agentWebhook, agentCreateItem } from "../controllers/agent.controller.js";

export const agentRoutes = Router();

agentRoutes.post("/agent/webhook", agentWebhook);
agentRoutes.post("/agent/create-item", agentCreateItem);

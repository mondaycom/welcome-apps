import { Router } from "express";
import { health, error, documentdb } from "../controllers/health.controller.js";

export const healthRoutes = Router();

healthRoutes.get("/health", health);
healthRoutes.get("/error", error);
healthRoutes.get("/documentdb", documentdb);

import { Router } from "express";
import { renderDashboard } from "../controllers/dashboard.controller.js";

export const dashboardRoute = Router();

dashboardRoute.get("/", renderDashboard);

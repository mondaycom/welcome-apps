import { Router } from "express";
import { authorizeRequest } from "../middleware/auth.js";
import { executeAction, getRemoteListOptions, regionalIntegration } from "../controllers/monday.controller.js";

export const mondayRoutes = Router();

mondayRoutes.post("/execute_action", authorizeRequest, executeAction);
mondayRoutes.post("/get_remote_list_options", authorizeRequest, getRemoteListOptions);
mondayRoutes.post("/regional-integration", authorizeRequest, regionalIntegration);

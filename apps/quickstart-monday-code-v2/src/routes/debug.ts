import { Router } from "express";
import { superHealth, longRequest, networking, storageTest } from "../controllers/debug.controller.js";

export const debugRoutes = Router();

debugRoutes.get("/super-health", superHealth);
debugRoutes.get("/long", longRequest);
debugRoutes.get("/networking", networking);
debugRoutes.get("/storage-test", storageTest);

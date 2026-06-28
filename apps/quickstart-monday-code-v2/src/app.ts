import express from "express";
import { healthRoutes } from "./routes/health.js";
import { debugRoutes } from "./routes/debug.js";
import { mondayRoutes } from "./routes/monday.js";
import { queueRoutes } from "./routes/queue.js";
import { webhookRoutes } from "./routes/webhook.js";
import { dashboardRoute } from "./routes/dashboard.js";
import { agentRoutes } from "./routes/agent.js";

const app = express();
app.use(express.json());

app.use("/", dashboardRoute);
app.use("/", healthRoutes);
app.use("/", debugRoutes);
app.use("/monday", mondayRoutes);
app.use("/", queueRoutes);
app.use("/", webhookRoutes);
app.use("/", agentRoutes);

export default app;

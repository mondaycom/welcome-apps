import type { Request, Response } from "express";
import { getSecretsObject, getEnvsObject } from "../config/index.js";
import { generateDashboardHtml } from "../views/dashboard.js";

export const renderDashboard = (_req: Request, res: Response): void => {
  const html = generateDashboardHtml({
    region: process.env.MNDY_REGION || "unknown",
    revisionTag: process.env.MNDY_TOPIC_NAME || "unknown",
    secretsObject: getSecretsObject(),
    envsObject: getEnvsObject(),
    processEnv: process.env as Record<string, string>,
    timestamp: new Date().toISOString(),
  });

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
};

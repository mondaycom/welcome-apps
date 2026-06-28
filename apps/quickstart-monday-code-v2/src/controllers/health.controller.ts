import { Logger } from "@mondaycom/apps-sdk";
import type { Request, Response } from "express";
import { checkMongoDBHealth } from "../services/mongodb-health.service.js";

const logger = new Logger("HealthController");

export const health = (_req: Request, res: Response): void => {
  res.status(200).send({ status: "OK", timestamp: new Date().toISOString() });
};

export const error = (_req: Request, res: Response): void => {
  res.status(500).send({ status: "ERROR", timestamp: new Date().toISOString() });
};

export const documentdb = async (_req: Request, res: Response): Promise<void> => {
  try {
    const healthResult = await checkMongoDBHealth();
    const allHealthy = healthResult.isConnected && healthResult.canWrite && healthResult.canRead;

    res.status(allHealthy ? 200 : 500).send({
      status: allHealthy ? "OK" : "UNHEALTHY",
      ...healthResult,
    });
  } catch (err) {
    logger.error(`MongoDB health check error: ${(err as Error).message}`, { error: err instanceof Error ? err : new Error(String(err)) });
    res.status(500).send({
      status: "ERROR",
      isConnected: false,
      canWrite: false,
      canRead: false,
      details: { error: (err as Error).message, timestamp: new Date().toISOString() },
    });
  }
};

import { Logger } from "@mondaycom/apps-sdk";
import type { Request, Response } from "express";
import { produceMessageWithPayload, readQueueMessage } from "../services/queue.service.js";

const logger = new Logger("QueueController");

export const produce = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body } = req;
    const messageId = await produceMessageWithPayload(body);
    res.status(200).send({ messageId });
  } catch (err) {
    logger.error(JSON.stringify(err));
    res.status(500).send({ message: "internal server error" });
  }
};

export const consumeQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body, query } = req;
    readQueueMessage({ body, query: query as Record<string, string> });
    res.status(200).send({});
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).send({ message: "internal server error" });
  }
};

export const cronjobTest = async (_req: Request, res: Response): Promise<void> => {
  const now = Date.now() + "";
  const messageId = await produceMessageWithPayload({
    message: "hello from cronjob test endpoint produced message",
    now,
  });

  res.status(200).send({ healthy: "OK", producedQueueMessageId: messageId });
};

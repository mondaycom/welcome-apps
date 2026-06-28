import { Logger } from "@mondaycom/apps-sdk";
import type { Request, Response } from "express";
import { envs, ENV_KEYS } from "../config/index.js";
import { processMovieLookup } from "../services/omdb.service.js";
import type { MovieLookupEvent } from "../services/omdb.service.js";

const logger = new Logger("WebhookController");

export const omdbWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body } = req;
    logger.info(`Incoming OMDb webhook received: ${JSON.stringify(body)}`);

    if (body.challenge) {
      res.status(200).send({ challenge: body.challenge });
      return;
    }

    const event = body.event as MovieLookupEvent | undefined;
    if (!event) {
      logger.warn("No event data in webhook payload");
      res.status(200).send({});
      return;
    }

    const { boardId, pulseId, pulseName } = event;
    if (!boardId || !pulseId || !pulseName) {
      logger.warn(`Missing required data in event: ${JSON.stringify({ boardId, pulseId, pulseName })}`);
      res.status(200).send({});
      return;
    }

    const token = envs.get(ENV_KEYS.DEV_ACCESS_TOKEN) as string | undefined;
    if (!token) {
      logger.error("DEV_ACCESS_TOKEN not found in environment");
      res.status(200).send({ message: "Could not process request (missing token)" });
      return;
    }

    const result = await processMovieLookup(token, event);

    if (!result.success && !result.movieInfo) {
      res.status(200).send({ message: result.message, searchedTitle: result.searchedTitle });
      return;
    }

    res.status(200).send({
      message: result.message,
      fromCache: result.fromCache,
      movieInfo: result.movieInfo,
      updatedColumn: result.updatedColumn,
    });
  } catch (err) {
    logger.error(`Internal server error in webhook: ${(err as Error).message}`, { error: err instanceof Error ? err : new Error(String(err)) });
    res.status(500).send({ message: "internal server error" });
  }
};

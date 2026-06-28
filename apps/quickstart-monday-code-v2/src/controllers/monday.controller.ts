import { Logger } from "@mondaycom/apps-sdk";
import type { Request, Response } from "express";
import { getColumnValue, changeColumnValue } from "../services/monday-api.service.js";
import { transformText } from "../services/transformation.service.js";
import { getSecret, ENV_KEYS, TRANSFORMATION_TYPES } from "../config/index.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

const logger = new Logger("MondayController");

export const executeAction = async (req: Request, res: Response): Promise<void> => {
  logger.info(JSON.stringify({ message: "New request received", path: "/monday/execute_action", body: req.body, headers: req.headers }));
  const { shortLivedToken } = (req as AuthenticatedRequest).session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    logger.info(`inputFields: ${JSON.stringify(inputFields)}`);
    const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inputFields;

    const text = await getColumnValue(shortLivedToken, itemId, sourceColumnId);
    if (!text) {
      res.status(200).send({});
      return;
    }
    const transformedText = transformText(text, transformationType ? transformationType.value : "TO_UPPER_CASE");

    await changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, transformedText);

    logger.info(`changeColumnValue finished: ${JSON.stringify({ shortLivedToken, boardId, itemId, targetColumnId, transformedText })}`);
    res.status(200).send({ itemId, targetColumnId, transformedText });
  } catch (err) {
    logger.error(`executeAction error: ${(err as Error).message}`, { error: err instanceof Error ? err : new Error(String(err)) });
    res.status(500).send({ message: "internal server error" });
  }
};

export const getRemoteListOptions = async (_req: Request, res: Response): Promise<void> => {
  const options = [
    { title: "to upper case", value: TRANSFORMATION_TYPES.TO_UPPER_CASE },
    { title: "to lower case", value: TRANSFORMATION_TYPES.TO_LOWER_CASE },
    { title: "to current region", value: TRANSFORMATION_TYPES.TO_CURRENT_REGION },
  ];
  try {
    res.status(200).send(options);
  } catch (err) {
    logger.error(`getRemoteListOptions error: ${(err as Error).message}`, { error: err instanceof Error ? err : new Error(String(err)) });
    res.status(500).send({ message: "internal server error" });
  }
};

export const regionalIntegration = async (req: Request, res: Response): Promise<void> => {
  logger.info(JSON.stringify({ message: "Region test action received", path: "/monday/regional-integration", body: req.body, headers: req.headers }));

  const { accountId, userId } = (req as AuthenticatedRequest).session;

  try {
    const region = process.env.MNDY_REGION || "UNKNOWN";
    const regionUpper = region.toUpperCase();
    const timestamp = new Date().toISOString();
    const serviceUrl = getSecret(ENV_KEYS.SERVICE_TAG_URL) || "N/A";

    logger.info(`Region test executed: ${JSON.stringify({ accountId, userId, region: regionUpper, timestamp })}`);

    res.status(200).send({
      success: true,
      region: regionUpper,
      regionRaw: region,
      timestamp,
      serviceUrl,
      message: `Successfully executed in ${regionUpper} region`,
      accountId,
      userId,
    });
  } catch (err) {
    logger.error(`Region test error: ${(err as Error).message}`, { error: err instanceof Error ? err : new Error(String(err)) });
    res.status(500).send({ message: "internal server error", error: (err as Error).message });
  }
};

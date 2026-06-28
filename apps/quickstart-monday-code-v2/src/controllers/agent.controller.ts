import type { Request, Response } from "express";
import { Logger } from "@mondaycom/apps-sdk";
import {
  resolveApiToken,
  getTriggerOutput,
  firstNonNullValue,
  changeColumnValue,
  createItem,
} from "../services/agent-api.service.js";

const logger = new Logger("AgentController");

export const agentWebhook = async (req: Request, res: Response): Promise<void> => {
  logger.info("Agent webhook received");
  logger.info(`Headers: ${JSON.stringify(req.headers)}`);
  logger.info(`Body: ${JSON.stringify(req.body)}`);

  const { token: apiToken, source: tokenSource } = resolveApiToken(req.headers.authorization);

  const triggerOutput = getTriggerOutput(req.body as Record<string, unknown>);
  const itemId = firstNonNullValue(triggerOutput?.itemId as Record<string, unknown>) as string | undefined;
  const boardId = firstNonNullValue(triggerOutput?.boardId as Record<string, unknown>) as string | undefined;

  const base = { receivedAt: new Date().toISOString() };

  if (!apiToken) {
    logger.warn("No API token found in request");
    res.status(200).json({
      success: true,
      ...base,
      message: "Webhook received; no API token — send Authorization JWT from monday or set MONDAY_API_TOKEN",
      itemId,
      boardId,
    });
    return;
  }

  if (!itemId) {
    logger.warn("No itemId in triggerOutput");
    res.status(200).json({ success: true, ...base, message: "Webhook received; no itemId found" });
    return;
  }

  const statusColumnId = process.env.MONDAY_STATUS_COLUMN_ID ?? "status";
  const statusLabel = process.env.MONDAY_STATUS_LABEL ?? "Done";

  logger.info(`Changing item ${itemId} status column "${statusColumnId}" → "${statusLabel}"`);

  try {
    await changeColumnValue({
      boardId: boardId!,
      itemId,
      columnId: statusColumnId,
      value: JSON.stringify({ label: statusLabel }),
      apiToken,
    });
    logger.info(`Status changed to "${statusLabel}"`);
    res.status(200).json({
      success: true,
      ...base,
      message: `Status changed to "${statusLabel}"`,
      itemId,
      boardId,
      authFromJwt: tokenSource === "jwt",
    });
  } catch (err) {
    logger.error(`Change status failed: ${(err as Error).message}`);
    res.status(200).json({
      success: false,
      ...base,
      message: (err as Error).message,
      itemId,
      boardId,
    });
  }
};

export const agentCreateItem = async (req: Request, res: Response): Promise<void> => {
  logger.info("Agent create-item webhook received");
  logger.info(`Body: ${JSON.stringify(req.body)}`);

  const { token: apiToken, source: tokenSource } = resolveApiToken(req.headers.authorization);
  const base = { receivedAt: new Date().toISOString() };

  if (!apiToken) {
    res.status(200).json({
      success: false,
      ...base,
      message: "No API token — send Authorization JWT from monday or set MONDAY_API_TOKEN",
    });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const triggerOutput = getTriggerOutput(body);
  const boardId = (body.boardId as string) ?? (firstNonNullValue(triggerOutput?.boardId as Record<string, unknown>) as string | undefined);
  const groupId = (body.groupId as string) ?? (firstNonNullValue(triggerOutput?.groupId as Record<string, unknown>) as string | undefined);

  if (!boardId) {
    res.status(200).json({ success: false, ...base, message: "No boardId provided" });
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const itemName = (body.itemName as string) ?? today;
  const dateColumnId = (body.dateColumnId as string) ?? process.env.MONDAY_DATE_COLUMN_ID ?? "date";
  const columnValues = (body.columnValues as Record<string, unknown>) ?? { [dateColumnId]: { date: today } };

  logger.info(`Creating item "${itemName}" on board ${boardId} (token source: ${tokenSource})`);

  try {
    const created = await createItem({ boardId, itemName, groupId, columnValues, apiToken });
    logger.info(`Item created: ${created?.id}`);
    res.status(200).json({ success: true, ...base, tokenSource, message: "Item created", item: created });
  } catch (err) {
    logger.error(`Create item failed: ${(err as Error).message}`);
    res.status(200).json({ success: false, ...base, tokenSource, message: (err as Error).message });
  }
};

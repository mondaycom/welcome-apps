import { Logger } from "@mondaycom/apps-sdk";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { getSecret, ENV_KEYS } from "../config/index.js";

const logger = new Logger("AuthMiddleware");

export interface SessionData {
  accountId: string;
  userId: string;
  backToUrl?: string;
  shortLivedToken: string;
}

export interface AuthenticatedRequest extends Request {
  session: SessionData;
}

export const authorizeRequest = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined = req.headers.authorization as string | undefined;
    if (!token && req.query) {
      token = req.query.token as string | undefined;
    }
    if (typeof token !== "string") {
      logger.info("No credentials in request");
      res.status(401).json({ error: "Not authenticated, no credentials in request" });
      return;
    }
    const signingSecret = getSecret(ENV_KEYS.MONDAY_SIGNING_SECRET);
    if (!signingSecret) {
      logger.error("Missing MONDAY_SIGNING_SECRET");
      res.status(500).json({ error: "Missing MONDAY_SIGNING_SECRET" });
      return;
    }
    const decoded = jwt.verify(token, signingSecret) as unknown as SessionData;
    const { accountId, userId, backToUrl, shortLivedToken } = decoded;
    logger.info(`token verified: ${JSON.stringify({ accountId, userId })}`);
    (req as AuthenticatedRequest).session = { accountId, userId, backToUrl, shortLivedToken };
    next();
  } catch (err) {
    logger.error("Auth error", { error: err instanceof Error ? err : new Error(String(err)) });
    res.status(500).json({ error: "Not authenticated" });
  }
};

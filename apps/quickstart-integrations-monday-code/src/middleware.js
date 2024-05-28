import { Logger } from "@mondaycom/apps-sdk";
import jwt from "jsonwebtoken";
import { getSecret } from "./helpers.js";

const MONDAY_SIGNING_SECRET = "MONDAY_SIGNING_SECRET";

export const authorizeRequest = (req, res, next) => {
  const logTag = "AuthorizationMiddleware";
  const logger = new Logger(logTag);
  try {
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token;
    }
    logger.info(`about to verify token: ${authorization}`);
    const signingSecret = getSecret(MONDAY_SIGNING_SECRET);
    logger.info(`verified token: ${JSON.stringify(signingSecret)}`);
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization,
      signingSecret
    );
    req.session = { accountId, userId, backToUrl, shortLivedToken };
    next();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Not authenticated" });
  }
};

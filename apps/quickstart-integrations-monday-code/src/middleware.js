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
    if (typeof authorization !== "string") {
      logger.info("No credentials in request");
      res.status(401).json({ error: "Not authenticated, no credentials in request" });
    }
    const signingSecret = getSecret(MONDAY_SIGNING_SECRET);
    if (signingSecret === undefined) {
      logger.error("Missing MONDAY_SIGNING_SECRET");
      res.status(500).json({error: "Missing MONDAY_SIGNING_SECRET"});
      return:
    }
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

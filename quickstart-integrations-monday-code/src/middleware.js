import { Logger } from '@mondaycom/apps-sdk';
import jwt from 'jsonwebtoken';
import { getSecret } from './helpers.js';

const MONDAY_SIGNING_SECRET = 'MONDAY_SIGNING_SECRET';

export const authorizeRequest = (req, res, next) => {
  const logTag = 'AuthorizationMiddleware';
  const logger = new Logger(logTag);
  try {
    let { authorization: token } = req.headers;
    if (!token && req.query) {
      token = req.query.token;
    }
    if (typeof authorization !== "string") {
      logger.info("No credentials in request");
      res.status(401).json({ error: "Not authenticated, no credentials in request" });
    }
    const signingSecret = getSecret(MONDAY_SIGNING_SECRET);
    if (signingSecret === undefined) {
      logger.error("Missing MONDAY_SIGNING_SECRET");
      res.status(500).json({error: "Missing MONDAY_SIGNING_SECRET"});
    }
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      token,
      signingSecret
    );
    logger.info(`token verified successfully: ${JSON.stringify({ accountId, userId, backToUrl, shortLivedToken })}`);
    req.session = { accountId, userId, backToUrl, shortLivedToken };
    next();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Not authenticated' });
  }
};

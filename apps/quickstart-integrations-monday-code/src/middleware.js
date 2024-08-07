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
    logger.info(`about to verify token: ${token}`);
    const signingSecret = getSecret(MONDAY_SIGNING_SECRET);
    logger.info(`signingSecret: ${signingSecret}`);
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

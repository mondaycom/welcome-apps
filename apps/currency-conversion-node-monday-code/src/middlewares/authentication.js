import jwt from 'jsonwebtoken';
import { getSecret } from '../helpers/secret-store.js';
import { MONDAY_SIGNING_SECRET } from '../constants/secret-keys.js';
import logger from '../services/logger/index.js';

const TAG = 'authentication_middleware';
/**
 * Checks that the authorization token in the header is signed with your app's signing secret.
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#authorization-header
 * @todo: Attach this middleware to every endpoint that receives requests from monday.com
 */
export async function authenticationMiddleware(req, res, next) {
  try {
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token;
    }
    const secret = getSecret(MONDAY_SIGNING_SECRET, { invalidate: true });
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization,
      secret
    );
    req.session = { accountId, userId, backToUrl, shortLivedToken };
    next();
  } catch (err) {
    logger.error('failed to authenticate', TAG, { error: err.message });
    res.status(401).json({ error: 'not authenticated' });
  }
}

import jwt from 'jsonwebtoken';
import { getSecret } from '../helpers/secret-store';
import { MONDAY_SIGNING_SECRET } from '../constants/secret-keys';

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
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization,
      getSecret(MONDAY_SIGNING_SECRET)
    );
    req.session = { accountId, userId, backToUrl, shortLivedToken };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'not authenticated' });
  }
}

import * as authService from '../services/auth-service.js';
import logger from '../services/logger/index.js';
import * as connectionModelService from '../services/model-services/connection-model-service.js';

const TAG = 'auth_controller';
/**
 * Begins the Github OAuth flow.
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#the-authorization-url
 * @todo Connect this to your product's OAuth flow.
 */
export const authorize = async (req, res) => {
  const { userId, backToUrl } = req.session;
  const authorizationUrl = authService.getAuthorizationUrl(userId, backToUrl);
  return res.redirect(authorizationUrl);
};

/**
 * Retrieves an OAuth token and then redirects the user to the backToUrl.
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#authorization-url-example
 * @todo Connect this to your product's OAuth flow.
 */
export const callback = async (req, res) => {
  const { userId } = req.params;
  const { code, state: backToUrl } = req.query;
  logger.info('oauth callback', TAG, { userId, code, backToUrl, query: req.query, params: req.params });

  try {
    const token = await authService.getToken(code);
    await connectionModelService.createConnection({ token, userId });

    return res.redirect(backToUrl);
  } catch (err) {
    logger.error('oauth callback failed', TAG, { userId, error: err.message });
    return res.status(500).send({ message: 'internal server error' });
  }
};
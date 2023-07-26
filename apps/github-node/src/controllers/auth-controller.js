const authService = require('../services/auth-service');
const connectionModelService = require('../services/model-services/connection-model-service');

/**
 * Begins the Github OAuth flow. 
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#the-authorization-url
 * @todo Connect this to your product's OAuth flow. 
 */
const authorize = async (req, res) => {
  const { userId, backToUrl } = req.session;
  const authorizationUrl = authService.getAuthorizationUrl(userId, backToUrl);
  return res.redirect(authorizationUrl);
};

/**
 * Retrieves an OAuth token and then redirects the user to the backToUrl. 
 * Docs: https://developer.monday.com/apps/docs/integration-authorization#authorization-url-example
 * @todo Connect this to your product's OAuth flow. 
 */
const callback = async (req, res) => {
  const { userId } = req.params;
  const { code, state: backToUrl } = req.query;

  try {
    const token = await authService.getToken(code);
    await connectionModelService.createConnection({ token, userId });

    return res.redirect(backToUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
};

module.exports = {
  authorize,
  callback,
};

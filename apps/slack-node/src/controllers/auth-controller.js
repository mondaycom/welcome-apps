// Helper functions if you want to implement OAuth in Slack from scratch, instead of using the Credentials App Feature which handles it for you. const { AuthorizationCode } = require('simple-oauth2');
const authService = require('../services/auth-service');
const connectionModelService = require('../services/model-services/connection-model-service');
const LoggerService = require('../services/monday-code/logger-service');

const authorize = async (req, res) => {
  const { userId, backToUrl } = req.session;
  const authorizationUrl = authService.getAuthorizationUrl(userId, backToUrl);
  return res.redirect(authorizationUrl);
};

const callback = async (req, res) => {
  const { userId } = req.params;
  const { code, state: backToUrl } = req.query;

  try {
    const token = await authService.getToken(code, userId);
    await connectionModelService.createConnection({ token, userId });

    return res.redirect(backToUrl);
  } catch (err) {
    LoggerService.getInstance().error('Authentication controller error', err);
    return res.status(500).send({ message: 'internal server error' });
  }
};

module.exports = {
  authorize,
  callback,
};

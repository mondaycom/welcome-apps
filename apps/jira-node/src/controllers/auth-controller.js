const { MondayAuthManager } = require('../services/auth-service');
const LoggerService = require('../services/monday-code/logger-service');
const util = require('util')

const logger = new LoggerService('authController')
const mondayAuthManager = new MondayAuthManager();

const authorize = async (req, res) => {
  const { userId, backToUrl } = req.session;
  const authorizationUrl = mondayAuthManager.getAuthorizationUrl(userId, backToUrl);
  logger.info({msg: 'Redirecting to authorization URL', data: {authorizationUrl}});
  return res.redirect(authorizationUrl);
};

const callback = async (req, res) => {
  const { userId } = req.params;
  const { code, state: backToUrl } = req.query;
  logger.info('POST to Callback URL', {data: { code }});
  try {
    const token = await mondayAuthManager.getToken(code);
    if (token?.error) {
      logger.error('Failed to get authorization token', JSON.stringify({token}));
      throw new Error('Error getting authorization token', token.error)
    } else {
      logger.info('Token received', {token: util.inspect(token)})
    }
    // TODO: store token
    return res.redirect(backToUrl);
  } catch (err) {
    logger.error('Failed to get authorization token', JSON.stringify({err}));
    return res.status(401).send({ message: 'failed to authenticate' });
  }
};

module.exports = {
  authorize,
  callback,
};

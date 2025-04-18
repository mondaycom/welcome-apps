const jwt = require('jsonwebtoken');
const LoggerService = require('../services/monday-code/logger-service');
const SecretsService = require('../services/monday-code/secrets-service');

async function authenticationMiddleware(req, res, next) {
  try {
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token;
    }
    const secretsManager = SecretsService.getInstance();
    const signingSecret = secretsManager.get('MONDAY_SIGNING_SECRET');
    
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization,
      signingSecret
    );
    req.session = { accountId, userId, backToUrl, shortLivedToken };
    next();
  } catch (err) {
    LoggerService.getInstance().error('Authentication error', err);
    return res.status(500).json({ error: 'Not authenticated. Did you add your monday signing secret to .env?' });
  }
}

module.exports = {
  authenticationMiddleware,
};

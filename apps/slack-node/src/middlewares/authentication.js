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
    if (!signingSecret) {
      throw new Error('MONDAY_SIGNING_SECRET is not configured');
    }

    const payload = jwt.verify(authorization, signingSecret);

    // Type guard to ensure payload is an object with the expected properties
    if (typeof payload === 'string' || !payload.accountId || !payload.userId) {
      throw new Error('Invalid JWT payload structure');
    }

    const { accountId, userId, backToUrl, shortLivedToken } = payload;

    // Store Monday.com authentication data on req.monday instead of overriding req.session
    // This avoids conflicts with express-session middleware
    req.monday = { accountId, userId, backToUrl, shortLivedToken };

    next();
  } catch (err) {
    LoggerService.getInstance().error('Authentication error', err);
    res.status(500).json({ error: 'Not authenticated. Did you add your monday signing secret to .env?' });
  }
}

module.exports = {
  authenticationMiddleware,
};

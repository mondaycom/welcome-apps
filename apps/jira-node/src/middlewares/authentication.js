const jwt = require('jsonwebtoken');
const { getSecret } = require('../helpers/secret-store');
const {MONDAY_SIGNING_SECRET} = require('../constants/secret-keys')
const LoggerService = require('../services/monday-code/logger-service');

const logger = new LoggerService('authMiddleware');

async function authenticationMiddleware(req, res, next) {
  try {
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token;
    }
    const signingSecret = getSecret(MONDAY_SIGNING_SECRET);
    logger.info({msg: 'auth middleware run', authorization, signingSecret});
    const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
      authorization,
      signingSecret
    );
    req.session = { accountId, userId, backToUrl, shortLivedToken };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'not authenticated' });
  }
}

module.exports = {
  authenticationMiddleware,
};
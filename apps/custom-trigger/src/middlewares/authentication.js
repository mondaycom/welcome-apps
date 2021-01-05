const jwt = require('jsonwebtoken');
const SHARED_SECRET = process.env.MONDAY_SIGNING_SECRET;

async function authenticationMiddleware(req, res, next) {
  try {
    let { authorization } = req.headers;
    if (!authorization && req.query) {
      authorization = req.query.token;
    }
    const { accountId, userId, backToUrl } = jwt.verify(
      authorization,
      process.env.MONDAY_SIGNING_SECRET
    );
    req.session = { accountId, userId, backToUrl };
    next();
  } catch (err) {
    res.status(500).json({ error: 'not authenticated' });
  }
}

module.exports = {
  authenticationMiddleware
};

const { AuthorizationCode } = require('simple-oauth2');
const { cache, cacheKeys } = require('../services/cache-service');

const SCOPES = ['repo'];

/**
 * Generate a Github OAuth URL.
 */
const getAuthorizationUrl = (userId, state) => {
  const client = getClient();

  const authorizationUrl = client.authorizeURL({
    redirect_uri: `${cache.get(cacheKeys.SERVER_URL)}/auth/callback/${userId}`,
    scope: SCOPES,
    state,
  });

  return authorizationUrl;
};

/**
 * Get a Github OAuth token.
 */
const getToken = async (code) => {
  const client = getClient();
  const response = await client.getToken({ code });
  const { access_token: token } = response.token;
  return token;
};

/**
 * Get a temporary OAuth authorization code. 
 */
const getClient = () => {
  return new AuthorizationCode({
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    auth: {
      tokenHost: process.env.TOKEN_HOST,
      tokenPath: process.env.TOKEN_PATH,
      authorizePath: process.env.AUTHORIZE_PATH,
    },
  });
};

module.exports = { getAuthorizationUrl, getToken };

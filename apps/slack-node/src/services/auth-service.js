const { AuthorizationCode } = require('simple-oauth2');
const { cache, cacheKeys } = require('../services/cache-service');

const SCOPES = ['chat:write', 'channels:read'];

const getAuthorizationUrl = (userId, state) => {
  const client = getClient();

  const authorizationUrl = client.authorizeURL({
    redirect_uri: getRedirectUri(userId),
    user_scope: SCOPES.join(','),
    state,
  });
  return authorizationUrl;
};

const getToken = async (code, userId) => {
  const client = getClient();
  const response = await client.getToken({ code, redirect_uri: getRedirectUri(userId) });

  // for this example we're using slack's user token and not bot token
  const { access_token: token } = response.token.authed_user;
  return token;
};

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

const getRedirectUri = (userId) => {
  return `${cache.get(cacheKeys.SERVER_URL)}/auth/callback/${userId}`;
};

module.exports = { getAuthorizationUrl, getToken };
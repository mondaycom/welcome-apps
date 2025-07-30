// Helper functions if you want to implement OAuth in Slack from scratch, instead of using the Credentials App Feature which handles it for you. 
const { AuthorizationCode } = require('simple-oauth2');
const { cache, cacheKeys } = require('../services/cache-service');
const EnvironmentVariablesService = require('./monday-code/environment-variables-service');
const SecretsService = require('./monday-code/secrets-service');

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
  const environmentManager = EnvironmentVariablesService.getInstance();
  const secretsManager = SecretsService.getInstance();

  const TOKEN_HOST = environmentManager.get('TOKEN_HOST');
  const TOKEN_PATH = environmentManager.get('TOKEN_PATH');
  const AUTHORIZE_PATH = environmentManager.get('AUTHORIZE_PATH');
  const CLIENT_ID = secretsManager.get('CLIENT_ID');
  const CLIENT_SECRET = secretsManager.get('CLIENT_SECRET');

  return new AuthorizationCode({
    client: {
      id: CLIENT_ID,
      secret: CLIENT_SECRET,
    },
    auth: {
      tokenHost: TOKEN_HOST,
      tokenPath: TOKEN_PATH,
      authorizePath: AUTHORIZE_PATH,
    },
  });
};

const getRedirectUri = (userId) => {
  return `${cache.get(cacheKeys.SERVER_URL)}/auth/callback/${userId}`;
};

module.exports = { getAuthorizationUrl, getToken };

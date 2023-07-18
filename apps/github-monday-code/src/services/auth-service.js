import { AuthorizationCode } from 'simple-oauth2';
import { cache, cacheKeys } from '../services/cache-service.js';

const SCOPES = ['repo'];

/**
 * Generate a Github OAuth URL.
 */
export const getAuthorizationUrl = (userId, state) => {
  const client = getClient();

  const authorizationUrl = client.authorizeURL({
    redirect_uri: `https://rami-github-monday.eu.ngrok.io/auth/callback/${userId}`,
    scope: SCOPES,
    state,
  });

  return authorizationUrl;
};

/**
 * Get a Github OAuth token.
 */
export const getToken = async (code) => {
  const client = getClient();
  const response = await client.getToken({ code });
  const { access_token: token } = response.token;
  return token;
};

/**
 * Get a temporary OAuth authorization code.
 */
export const getClient = () => {
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

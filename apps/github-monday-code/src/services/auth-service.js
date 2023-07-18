import { AuthorizationCode } from 'simple-oauth2';
import { AUTHORIZE_PATH, CLIENT_ID, CLIENT_SECRET, TOKEN_HOST, TOKEN_PATH } from '../constants/secret-keys.js';
import { getSecret } from '../helpers/secret-store.js';

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
      id: getSecret(CLIENT_ID),
      secret: getSecret(CLIENT_SECRET),
    },
    auth: {
      tokenHost: getSecret(TOKEN_HOST),
      tokenPath: getSecret(TOKEN_PATH),
      authorizePath: getSecret(AUTHORIZE_PATH),
    },
  });
};

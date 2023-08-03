import mondaySdk from 'monday-sdk-js';
import { AuthorizationCode } from 'simple-oauth2';
import { AUTHORIZE_PATH, CLIENT_ID, CLIENT_SECRET, TOKEN_HOST, TOKEN_PATH, MONDAY_OAUTH_CLIENT_ID, MONDAY_OAUTH_CLIENT_SECRET, MONDAY_OAUTH_TOKEN_PATH, MONDAY_OAUTH_HOST, MONDAY_OAUTH_AUTHORIZE_PATH } from '../constants/secret-keys.js';
import { getSecret } from '../helpers/secret-store.js';
import { getBaseUrl } from '../helpers/environment.js';

const monday = mondaySdk();
const SCOPES = ['repo'];

class BaseAuthManager {
  getAuthorizationUrl = (userId, state) => {
    throw new Error('Not implemented');
  };

  getToken = async (code) => {
    throw new Error('Not implemented');
  };
}

export class GithubAuthManager extends BaseAuthManager {
  getAuthorizationUrl = (userId, state) => {
    const client = this._getClient();
    const redirectUri = `${getBaseUrl()}/auth/github/callback/${userId}`;
    const authorizationUrl = client.authorizeURL({
      redirect_uri: redirectUri,
      scope: SCOPES,
      state,
    });

    return authorizationUrl;
  };

  getToken = async (code) => {
    const client = this._getClient();
    const response = await client.getToken({ code });
    const { access_token: token } = response.token;
    return token;
  };

  _getClient = () => {
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
}

export class MondayAuthManager extends BaseAuthManager {
  getAuthorizationUrl = (userId, state) => {
    const client = this._getClient();
    const authorizationUrl = client.authorizeURL({
      state,
    });

    return authorizationUrl;
  };

  getToken = async (code) => {
    // const client = this._getClient();
    const response = await monday.oauthToken(code, getSecret(MONDAY_OAUTH_CLIENT_ID), getSecret(MONDAY_OAUTH_CLIENT_SECRET));
    return response?.access_token || response?.token || response;
  };

  _getClient = () => {
    return new AuthorizationCode({
      client: {
        id: getSecret(MONDAY_OAUTH_CLIENT_ID),
        secret: getSecret(MONDAY_OAUTH_CLIENT_SECRET),
      },
      auth: {
        tokenHost: getSecret(MONDAY_OAUTH_HOST),
        tokenPath: getSecret(MONDAY_OAUTH_TOKEN_PATH),
        authorizePath: getSecret(MONDAY_OAUTH_AUTHORIZE_PATH),
      },
    });
  };
}

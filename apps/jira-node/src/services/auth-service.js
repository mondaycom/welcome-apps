const mondaySdk = require('monday-sdk-js');
const { AuthorizationCode } = require('simple-oauth2');
const {
  MONDAY_SCOPES,
  MONDAY_OAUTH_CLIENT_ID,
  MONDAY_OAUTH_CLIENT_SECRET,
  MONDAY_OAUTH_TOKEN_PATH,
  MONDAY_OAUTH_HOST,
  MONDAY_OAUTH_AUTHORIZE_PATH,
} = require('../constants/secret-keys.js');
const { getSecret } = require('../helpers/secret-store.js');
const { getBaseUrl, getAppVersion } = require('../helpers/environment.js');
const LoggerService = require('./monday-code/logger-service.js');

const monday = mondaySdk();
const logger = new LoggerService('authService');

class BaseAuthManager {
  constructor() {
    // Base constructor can be empty since we're not initializing any properties
  }

  getAuthorizationUrl = (userId, state) => {
    throw new Error('Not implemented');
  };

  getToken = async (code) => {
    throw new Error('Not implemented');
  };
}

class MondayAuthManager extends BaseAuthManager {
  constructor() {
    super(); // Call the parent constructor
    // Initialize any instance properties here if needed
  }

  getAuthorizationUrl = (userId, state) => {
    try {
      const client = this._getClient();
      const redirectUri = `${getBaseUrl()}/auth/monday/callback`;
      const scope = getSecret(MONDAY_SCOPES);
      const appVersion = getAppVersion();
      if (appVersion) {
        const authorizationUrl = client.authorizeURL({
          state,
          redirect_uri: redirectUri,
          scope,
          app_version_id: appVersion, 
        });
        return authorizationUrl;
      } else {
        const authorizationUrl = client.authorizeURL({
          state,
          redirect_uri: redirectUri,
          scope,
        });
        return authorizationUrl;
      }

    } catch (err) {
      logger.error('error getting auth URL', err);
    }
  };

  getToken = async (code) => {
    // TODO: DELETE COMMENTED CODE
    try {
      logger.info('Function call: authService.getToken');
      // const client = this._getClient();
      const client = new AuthorizationCode({ // i think circular reference error is coming from here
        client: {
          id: getSecret(MONDAY_OAUTH_CLIENT_ID),
          secret: getSecret(MONDAY_OAUTH_CLIENT_SECRET),
        },
        auth: {
          tokenHost: getSecret(MONDAY_OAUTH_HOST),
          tokenPath: getSecret(MONDAY_OAUTH_TOKEN_PATH),
          authorizePath: getSecret(MONDAY_OAUTH_AUTHORIZE_PATH),
        },
      })
      const redirectUri = `${getBaseUrl()}/auth/monday/callback`;
      const scope = getSecret(MONDAY_SCOPES)
      logger.info('Getting OAuth access token - ', JSON.stringify({redirectUri, scope}));
      const response = await client.getToken({ // FIXME: this is where an error is thrown
        code,
        redirect_uri: redirectUri,
        scope,
      });
      // const response = await monday.oauthToken(code, getSecret(MONDAY_OAUTH_CLIENT_ID), getSecret(MONDAY_OAUTH_CLIENT_SECRET))
      logger.info({msg: 'Received access token', token: response?.token, err: response?.error});
      return response?.access_token || response?.token || response;
    } catch (err) {
      logger.info('error getting token - ', err);
      throw new Error('Error getting authorization token', {err});
    }
  };

  _getClient = () => {
    // TODO: Fix "TypeError: Circular reference" - which is cropping up from _somewhere_
    try {
      logger.info('function call: authService._getClient');
      const clientData = {
        id: getSecret(MONDAY_OAUTH_CLIENT_ID),
        secret: getSecret(MONDAY_OAUTH_CLIENT_SECRET),
      };
      const authData = {
        tokenHost: getSecret(MONDAY_OAUTH_HOST),
        tokenPath: getSecret(MONDAY_OAUTH_TOKEN_PATH),
        authorizePath: getSecret(MONDAY_OAUTH_AUTHORIZE_PATH),
      };
  
      // logger.info({ msg: 'Client info:', data: { clientData, authData } }); // TODO: Remove log; it exposes secrets
  
      const client = new AuthorizationCode({ // i think circular reference error is coming from here
        client: clientData,
        auth: authData,
      });
      return client;
    } catch (err) {
      logger.error('error setting client data', {err})
    }
  };
}

module.exports = {
  MondayAuthManager,
  BaseAuthManager,
};

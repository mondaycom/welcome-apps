const { getSecret, getEnvVariable } = require('./secret-store');
const DEVELOPMENT_ENV = 'development';
const { NODE_ENV, SERVICE_TAG_URL } = require('../constants/secret-keys');
const { VERSION_ID } = require('../constants/env-variable-keys');
const { cache, cacheKeys } = require('../services/cache-service');

const getEnv = () => (getSecret(NODE_ENV) || DEVELOPMENT_ENV).toLowerCase();
const isDevelopmentEnv = () => getEnv() === DEVELOPMENT_ENV;
const isProductionEnv = () => !isDevelopmentEnv();

const getBaseUrl = () => {
  if (isDevelopmentEnv()) {
    return cache.get(cacheKeys.SERVER_URL);
  }

  return `${getSecret(SERVICE_TAG_URL)}`;
};

const getAppVersion = () => {
  return getEnvVariable(VERSION_ID);
};

module.exports = {
  getEnv,
  isDevelopmentEnv,
  isProductionEnv,
  getBaseUrl,
  getAppVersion,
};

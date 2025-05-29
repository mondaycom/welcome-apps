const SecretsService = require('../services/monday-code/secrets-service');
const LoggerService = require('../services/monday-code/logger-service');
const EnvironmentVariablesService = require('../services/monday-code/environment-variables-service');

const logger = new LoggerService('secrets')

const getSecret = (secretKey, options = {}) => {
  const secretManager = SecretsService.getInstance();
  try {const secret = secretManager.get(secretKey, options);
  return secret;
} catch (err) {
  logger.error('Error getting secret', {secretKey})
}
};

const getEnvVariable = (envVariableKey, options = {}) => {
  const envManager = EnvironmentVariablesService.getInstance();
  try {
    const envVariable = envManager.get(envVariableKey);
    return envVariable;
  } catch (err) {
    logger.error('Error getting environment variable', {envVariableKey});
  }
}

const getEnvKeys = () => {
  const secretManager = SecretsService.getInstance();
  const keys = secretManager.getKeys();
  return keys;
};

module.exports = {
    getSecret,
    getEnvKeys,
    getEnvVariable,
}
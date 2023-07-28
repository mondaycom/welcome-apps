import { EnvironmentVariablesManager } from '@mondaycom/apps-sdk';
import dotenv from 'dotenv';

const secretManager = new EnvironmentVariablesManager();

dotenv.config();
/**
 * Retrieves the value of a secret based on the provided secret key.
 *
 * This function accesses the `EnvironmentVariablesManager` to fetch the value associated with the given secret key.
 * If the secret is found, its value is returned. If the secret key is not found or its value is not set, the function
 * returns `undefined`.
 * visit https://github.com/mondaycom/apps-sdk#environment-variables-manager for documentation
 *
 * @param {string} secretKey - The key to identify the secret.
 * @param {object} options - (Optional) Additional options for retrieving the secret.
 * @param {boolean} options.invalidate - If set to `true`, it will invalidate cached data before fetching the secret.
 * @returns {string | undefined} The value of the secret, or `undefined` if the secret key is not found or its value is not set.
 */
export const getSecret = (secretKey, options = {}) => {
  const secret = secretManager.get(secretKey, options);
  return secret;
};

/**
 * Retrieves all the keys of environment variables stored in the EnvironmentVariablesManager.
 *
 * This function fetches the keys used to access the environment variables from the EnvironmentVariablesManager,
 * allowing developers to understand which variables are available for use in the application.
 *
 * @returns {string[]} An array containing all the keys of environment variables.
 */
export const getEnvKeys = () => {
  const keys = secretManager.getKeys();
  return keys;
};

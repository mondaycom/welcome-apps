import { EnvironmentVariablesManager } from "@mondaycom/apps-sdk";
const secretManager = new EnvironmentVariablesManager();
const DEVELOPMENT_ENV = "development";

export const isDevelopmentEnv = () => {
  const currentEnv = (getSecret("NODE_ENV") || DEVELOPMENT_ENV).toLowerCase();
  return currentEnv === "development";
};

export const getEnv = () =>
  (getSecret("NODE_ENV") || DEVELOPMENT_ENV).toLowerCase();

export const getSecret = (secretKey, options = {}) => {
  const secret = secretManager.get(secretKey, options);
  return secret;
};

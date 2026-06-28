import dotenv from "dotenv";
import { EnvironmentVariablesManager, Logger, SecretsManager } from "@mondaycom/apps-sdk";

dotenv.config();

export const envs = new EnvironmentVariablesManager({ updateProcessEnv: true });
export const logger = new Logger("App");

export const ENV_KEYS = {
  PORT: "PORT",
  SERVICE_TAG_URL: "SERVICE_TAG_URL",
  DEV_ACCESS_TOKEN: "DEV_ACCESS_TOKEN",
  MONDAY_SIGNING_SECRET: "MONDAY_SIGNING_SECRET",
} as const;

export const TRANSFORMATION_TYPES = {
  TO_UPPER_CASE: "TO_UPPER_CASE",
  TO_LOWER_CASE: "TO_LOWER_CASE",
  TO_CURRENT_REGION: "TO_CURRENT_REGION",
} as const;

export const getSecret = (secretKey: string, options = {}): string | undefined => {
  return envs.get(secretKey, options) as string | undefined;
};

export const getEnv = (): string => {
  const currentEnv = (getSecret("NODE_ENV") || "development").toLowerCase();
  return currentEnv;
};

export const isDevelopmentEnv = (): boolean => getEnv() === "development";

export const getSecretsObject = (): Record<string, string | undefined> => {
  const secrets = new SecretsManager();
  const obj: Record<string, string | undefined> = {};
  for (const key of secrets.getKeys()) {
    obj[key] = secrets.get(key) as string | undefined;
  }
  return obj;
};

export const getEnvsObject = (): Record<string, string | undefined> => {
  const obj: Record<string, string | undefined> = {};
  for (const key of envs.getKeys()) {
    obj[key] = envs.get(key) as string | undefined;
  }
  return obj;
};

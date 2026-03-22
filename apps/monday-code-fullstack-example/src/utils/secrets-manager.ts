import { SecretsManager as MondaySecretsManager } from '@mondaycom/apps-sdk';

const secretsManager = new MondaySecretsManager();

const getSecret = (key: string) => {
  if (process.env.NODE_ENV === 'development') {
    return process.env[key];
  }
  return secretsManager.get(key);
};

export { getSecret };

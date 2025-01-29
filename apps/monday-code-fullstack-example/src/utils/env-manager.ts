import { EnvironmentVariablesManager } from '@mondaycom/apps-sdk';

export class EnvManager {
  private envManager: EnvironmentVariablesManager;

  constructor() {
    this.envManager = new EnvironmentVariablesManager({
      updateProcessEnv: true,
    });
  }

  get(key: string) {
    if (process.env.NODE_ENV === 'development') {
      return process.env[key];
    }
    return this.envManager.get(key);
  }
}

import { Logger } from "@mondaycom/apps-sdk";
import { EnvManager } from "./env-manager";

type LogOptions = {
  [key: string]: any;
};

const tag = "Monday Code App";
const mondayLogger = new Logger(tag);
const envManager = new EnvManager();

class CustomLogger {
  private isLocal: boolean;

  constructor() {
    this.isLocal = envManager.get('LOCAL') === 'true';
  }

  private formatMessage(message: any): string {
    if (typeof message === 'string') {
      return message;
    }
    try {
      return JSON.stringify(message, null, 2);
    } catch (err) {
      return String(message);
    }
  }

  info(message: any, options?: LogOptions) {
    const formattedMessage = this.formatMessage(message);
    if (this.isLocal) {
      console.log(`[INFO] ${formattedMessage}${options ? '\n' + JSON.stringify(options, null, 2) : ''}`);
    } else {
      mondayLogger.info(formattedMessage);
    }
  }

  error(message: any, options?: LogOptions) {
    const formattedMessage = this.formatMessage(message);
    if (this.isLocal) {
      console.error(`[ERROR] ${formattedMessage}${options ? '\n' + JSON.stringify(options, null, 2) : ''}`);
    } else {
      mondayLogger.error(formattedMessage, options);
    }
  }

  warn(message: any, options?: LogOptions) {
    const formattedMessage = this.formatMessage(message);
    if (this.isLocal) {
      console.warn(`[WARN] ${formattedMessage}${options ? '\n' + JSON.stringify(options, null, 2) : ''}`);
    } else {
      mondayLogger.warn(formattedMessage);
    }
  }

  debug(message: any, options?: LogOptions) {
    const formattedMessage = this.formatMessage(message);
    if (this.isLocal) {
      console.debug(`[DEBUG] ${formattedMessage}${options ? '\n' + JSON.stringify(options, null, 2) : ''}`);
    } else {
      mondayLogger.debug(formattedMessage);
    }
  }
}

const logger = new CustomLogger();
export default logger;

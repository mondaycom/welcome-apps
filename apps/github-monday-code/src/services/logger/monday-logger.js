import { Logger } from '@mondaycom/apps-sdk';
import BaseLogger from './base-logger.js';

/**
 * This logger provides a simple way to log messages for your app in a project deployed <monday-code/>.
 * Logged messages are accessible via "@mondaycom/apps-cli"
 * using `$ mapps code:logs`
 * Logs written without this logger may not be accessible via @mondaycom/apps-cli or not get labeled correctly
 */
class MondayLogger extends BaseLogger {
  constructor() {
    super();
  }

  info(message, tag, options) {
    new Logger(tag).info(message, options);
  }

  warn(message, tag, options) {
    new Logger(tag).warn(message, options);
  }

  error(message, tag, options) {
    new Logger(tag).error(message, options);
  }

  debug(message, tag, options) {
    new Logger(tag).debug(message, options);
  }
}
export default MondayLogger;

import { Logger } from '@mondaycom/apps-sdk';
import BaseLogger from './base-logger.js';

/**
 * This logger provides a simple way to log messages for your app in a project deployed <monday-code/>.
 * Logged messages are accessible via "@mondaycom/apps-cli" https://github.com/mondaycom/monday-code-cli#mapps-codelogs
 * using `$ mapps code:logs`
 * Logs written without this logger may not be accessible via @mondaycom/apps-cli or not get labeled correctly
 * visit https://github.com/mondaycom/apps-sdk#logger for documentation
 */
class MondayLogger extends BaseLogger {
  constructor() {
    super();
  }

  info(message, tag, options) {
    new Logger(tag).info(message + ' PARAMS:- \n' + JSON.stringify(options));
  }

  warn(message, tag, options) {
    new Logger(tag).warn(message + ' PARAMS:- \n' + JSON.stringify(options));
  }

  error(message, tag, options) {
    new Logger(tag).error(message + ' PARAMS:- \n' + JSON.stringify(options));
  }

  debug(message, tag, options) {
    new Logger(tag).debug(message + ' PARAMS:- \n' + JSON.stringify(options));
  }
}
export default MondayLogger;

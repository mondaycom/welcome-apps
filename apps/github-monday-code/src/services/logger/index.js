import { isDevelopmentEnv } from '../../helpers/environment.js';
import BaseLogger from './base-logger.js';
import MondayLogger from './monday-logger.js';

const Logger = isDevelopmentEnv() ? BaseLogger : MondayLogger;

export default new Logger();

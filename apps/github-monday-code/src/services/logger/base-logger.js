class BaseLogger {
  constructor() {}

  /**
   * Logs an informational message with the specified tag.
   * @param {string} message - The message to be logged.
   * @param {string} tag - The tag associated with the log message.
   * @param {Object} options - (Optional) Additional options for logging.
   * @returns {void}
   */
  info(message, tag, options) {
    console.info('info: ', tag, message, options ? JSON.stringify(options) : '');
  }

  /**
   * Logs a warning message with the specified tag.
   * @param {string} message - The warning message to be logged.
   * @param {string} tag - The tag associated with the log message.
   * @param {Object} options - (Optional) Additional options for logging.
   * @returns {void}
   */
  warn(message, tag, options) {
    console.warn('warn: ', tag, message, options ? JSON.stringify(options) : '');
  }

  /**
   * Logs an error message with the specified tag.
   * @param {string} message - The error message to be logged.
   * @param {string} tag - The tag associated with the log message.
   * @param {Object} options - (Optional) Additional options for logging.
   * @returns {void}
   */
  error(message, tag, options) {
    console.error('error: ', tag, message, options ? JSON.stringify(options) : '');
  }

  /**
   * Logs a debug message with the specified tag.
   * @param {string} message - The debug message to be logged.
   * @param {string} tag - The tag associated with the log message.
   * @param {Object} options - (Optional) Additional options for logging.
   * @returns {void}
   */
  debug(message, tag, options) {
    console.debug('debug: ', tag, message, options ? JSON.stringify(options) : '');
  }
}

export default BaseLogger;

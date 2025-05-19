const { Logger } = require('@mondaycom/apps-sdk')
const packageJson = require('../../../package.json');

class LoggerService {
    static instance;
    constructor(tag) {
        this.mondayCodeLoggerManager = new Logger((packageJson.name || 'my-app') + ' ' + tag)
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new LoggerService();
        }
        return this.instance;
    }

    debug(message) {
        return this.mondayCodeLoggerManager.debug(message);
    }

    error(message, error) {
        return this.mondayCodeLoggerManager.error(message, { error });
    }

    info(message) {
        return this.mondayCodeLoggerManager.info(message);
    }

    warn(message) {
        return this.mondayCodeLoggerManager.warn(message);
    }
}

module.exports = LoggerService;
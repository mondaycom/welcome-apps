const { EnvironmentVariablesManager } = require('@mondaycom/apps-sdk');

class EnvironmentVariablesService {
    static instance;
    constructor() {
        this.envManager = new EnvironmentVariablesManager();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new EnvironmentVariablesService();
        }
        return this.instance;
    }

    get(key, options = { invalidate: true }) {
        return this.envManager.get(key, options);
    }

    getKeys(options = { invalidate: true }) {
        return this.envManager.getKeys(options);
    }
}

module.exports = EnvironmentVariablesService;

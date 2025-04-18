const { SecretsManager } = require('@mondaycom/apps-sdk');

class SecretsService {
    static instance;
    constructor() {
        this.secretsManager = new SecretsManager();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new SecretsService();
        }
        return this.instance;
    }

    get(key, options = { invalidate: true }) {
        return this.secretsManager.get(key, options);
    }

    getKeys(options = { invalidate: true }) {
        return this.secretsManager.getKeys(options);
    }
}

module.exports = SecretsService;

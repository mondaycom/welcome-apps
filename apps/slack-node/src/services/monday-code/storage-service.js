const { Storage } = require('@mondaycom/apps-sdk')

class StorageService {
    static instance;
    constructor(token) {
        if (!token) {
            throw new Error('Unauthorized: Token is required for storage service');
        }
        this.mondayCodeStorageManager = new Storage(token)
    }

    delete(key, options) {
        return this.mondayCodeStorageManager.delete(key, options);
    }

    get(key, options) {
        return this.mondayCodeStorageManager.get(key, options);
    }

    set(key, value, options) {
        return this.mondayCodeStorageManager.set(key, value, options);
    }
}

module.exports = StorageService;
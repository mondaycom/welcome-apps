const { Storage } = require('@mondaycom/apps-sdk')

/**
 * Service class for managing storage operations using Monday.com's SDK
 * @class StorageService
 * @method delete - Deletes a value from storage
 * @method get - Retrieves a value from storage
 * @method set - Stores a value in storage
 */
class StorageService {
    /**
     * Creates a new instance of StorageService
     * @param {string} token - The authentication token required for storage operations
     * @throws {Error} Throws an error if token is not provided
     */
    constructor(token) {
        if (!token) {
            throw new Error('Unauthorized: Token is required for storage service');
        }
        this.mondayCodeStorageManager = new Storage(token)
    }

    /**
     * Deletes a value from storage
     * @param {string} key - The key of the value to delete
     * @param {Object} [options] - Optional parameters for the delete operation
     * @returns {Promise<any>} A promise that resolves when the deletion is complete
     */
    delete(key, options) {
        return this.mondayCodeStorageManager.delete(key, options);
    }

    /**
     * Retrieves a value from storage
     * @param {string} key - The key of the value to retrieve
     * @param {Object} [options] - Optional parameters for the get operation
     * @returns {Promise<any>} A promise that resolves with the retrieved value
     */
    get(key, options) {
        return this.mondayCodeStorageManager.get(key, options);
    }

    /**
     * Stores a value in storage
     * @param {string} key - The key under which to store the value
     * @param {any} value - The value to store
     * @param {Object} [options] - Optional parameters for the set operation, passed to `mondayCodeStorageManager`
     * @returns {Promise<any>} A promise that resolves when the value is stored
     */
    set(key, value, options) {
        return this.mondayCodeStorageManager.set(key, value, options);
    }
}

StorageService.instance = null;

module.exports = StorageService;
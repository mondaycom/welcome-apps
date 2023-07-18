import { Storage } from '@mondaycom/apps-sdk';

class BaseStorage {
  constructor(token) {
    this.storage = new Storage(token);
  }
  /**
   * @typedef {Object} Options
   * @property {string} [token] - The token value.
   * @property {string} [previousVersion] - The previous version.
   */
  
  /**
   * Sets a value in the storage.
   * @param {string} key - The key for the value.
   * @param {*} value - The value to be stored.
   * @param {Options} [options] - Additional options.
   * @returns {Promise<void>} A Promise representing the completion of the set operation.
   */
  async set(key, value, options) {
    return await this.storage.set(key, value, options);
  }

  /**
   * Retrieves a value from the storage.
   * @param {string} key - The key for the value.
   * @param {Options} [options] - Additional options.
   * @returns {Promise<any>} A Promise representing the retrieved value.
   */
  async get(key, options) {
    return await this.storage.get(key, options);
  }

  /**
   * Deletes a value from the storage.
   * @param {string} key - The key for the value to delete.
   * @param {Options} [options] - Additional options.
   * @returns {Promise<void>} A Promise representing the completion of the delete operation.
   */
  async delete(key, options) {
    return await this.storage.delete(key, options);
  }
}

export default BaseStorage;

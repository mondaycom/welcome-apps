const { SecureStorage } = require('@mondaycom/apps-sdk');

class SecureStorageService {
  static instance;
  constructor() {
    this.mondayCodeSecureStorageManager = new SecureStorage();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SecureStorageService();
    }
    return this.instance;
  }

  set(key, value) {
    return this.mondayCodeSecureStorageManager.set(key, value);
  }

  get(key) {
    return this.mondayCodeSecureStorageManager.get(key);
  }

  delete(key) {
    return this.mondayCodeSecureStorageManager.delete(key);
  }
}

module.exports = SecureStorageService;

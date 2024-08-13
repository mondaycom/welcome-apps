import BaseSecureStorage from './base-secure-storage.js';

class ConnectionStorage extends BaseSecureStorage {
  constructor() {
    super();
    this.prefix = 'connection_';
  }
}

export default ConnectionStorage;

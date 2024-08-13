import BaseSecureStorage from './base-secure-storage.js';

class UserSubscriptionRelationStorage extends BaseSecureStorage {
  constructor() {
    super();
    this.prefix = 'sub_to_user_';
  }
}

export default UserSubscriptionRelationStorage;

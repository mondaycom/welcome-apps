const StorageService = require('../monday-code/storage-service');

/**
 * Constructs a primary key for a subscription in the storage service
 * @param {string} subscriptionId - The unique identifier for the subscription
 * @returns {string} The formatted primary key for the subscription
 */
const constructSubscriptionPk = (subscriptionId) => {
  return `subscription:${subscriptionId}`;
}

/**
 * Retrieves a subscription from storage by its ID
 * @param {string} subscriptionId - The unique identifier for the subscription
 * @param {string} token - The authentication token for storage operations
 * @returns {Promise<Object|null>} The subscription data if found, null if not found or on error
 */
const getSubscription = async (subscriptionId, token) => {
  try {
    const storageService = new StorageService(token);
    const key = constructSubscriptionPk(subscriptionId)
    return await storageService.get(key)
  } catch (err) {
    console.error(err);
  }
};

/**
 * Creates a new subscription in storage
 * @param {Object} attributes - The subscription attributes
 * @param {string} attributes.mondayWebhookUrl - The webhook URL for Monday.com integration
 * @param {string} attributes.subscriptionId - The unique identifier for the subscription
 * @param {string} token - The authentication token for storage operations
 * @returns {Promise<void>}
 */
const createSubscription = async (attributes, token) => {
  const { mondayWebhookUrl, subscriptionId } = attributes;
  try {
    const storageService = new StorageService(token);
    const key = constructSubscriptionPk(subscriptionId);
    const subscriptionData = {
      mondayWebhookUrl,
      active: true
    }
    const result = await storageService.set(key, JSON.stringify(subscriptionData));
    console.log({msg: 'Created subscription', data: JSON.stringify({subscriptionId, result})});
    return result;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Updates an existing subscription with new data
 * @param {string} subscriptionId - The unique identifier for the subscription
 * @param {Object} updates - The updates to apply to the subscription
 * @param {string} token - The authentication token for storage operations
 * @returns {Promise<Object>} The result of the update operation
 * @throws {Error} If the subscription cannot be retrieved from storage
 */
const updateSubscription = async (subscriptionId, updates, token) => {
  try {
    const storageService = new StorageService(token);
    const key = constructSubscriptionPk(subscriptionId);
    // Get current value and version
    const oldDataResult = await storageService.get(key);
    console.log({msg: 'Retrieved subscription from storage', oldDataResult})
    if (!oldDataResult.success) {
      throw new Error(`Could not get subscription ${subscriptionId} from storage`)
    }
    const oldData = JSON.parse(oldDataResult.value);
    // Add updates to value
    const newData = {
      ...updates,
      ...oldData
    }
    // Set new value with version
    return await storageService.set(key, JSON.stringify(newData), {previousVersion: oldData.version});
  } catch (err) {
    console.error(err);
  }
};

/**
 * Soft deletes a subscription by setting its active status to false
 * @param {string} subscriptionId - The unique identifier for the subscription
 * @param {string} token - The authentication token for storage operations
 * @returns {Promise<Object>} The result of the update operation
 */
const deleteSubscription = async (subscriptionId, token) => {
  try {
    return await updateSubscription(subscriptionId, {active: false}, token);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};

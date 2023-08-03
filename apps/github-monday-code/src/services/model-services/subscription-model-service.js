import { v4 as uuidv4 } from 'uuid';
import BaseStorage from '../../storage/base-storage.js';
import logger from '../logger/index.js';
import UserSubscriptionRelationStorage from '../../storage/user-subscription-relation-storage.js';

const TAG = 'subscription_model_service';

/** @typedef {Object} Subscription
 * @property {string} id - The unique ID of the subscription
 * @property {boolean} active - Whether the subscription is active
 * @property {string} mondayWebhookUrl - The webhook URL that monday will send events to
 * @property {string} owner - The owner of the Github repo
 * @property {string} repo - The name of the Github repo
 * @property {string} mondayUserId - The monday user ID
 * @property {number} webhookId - The ID of the webhook that was created in Github
 */

/**
 * A service for interacting with Subscription objects.
 * A Subscription defines a relation between a monday trigger and a Github repo.
 * @param {string} mondayToken - The monday token of the user
 * @returns {SubscriptionModelService} - An instance of the SubscriptionModelService
 *
 * @example
 * const subscriptionModelService = new SubscriptionModelService(mondayToken);
 * const subscription = await subscriptionModelService.getSubscription(subscriptionId);
 *
 * @example
 * const subscriptionModelService = new SubscriptionModelService(mondayToken);
 * const subscription = await subscriptionModelService.createSubscription(attributes);
 *
 * @example
 * const subscriptionModelService = new SubscriptionModelService(mondayToken);
 * const subscription = await subscriptionModelService.updateSubscription(subscriptionId, updates);
 *
 * @example
 * const subscriptionModelService = new SubscriptionModelService(mondayToken);
 * const subscription = await subscriptionModelService.deleteSubscription(subscriptionId);
 */
export class SubscriptionModelService {
  constructor(mondayToken) {
    this.storage = new BaseStorage(mondayToken);
    this.relationsStorage = new UserSubscriptionRelationStorage();
  }

  /**
   * Retrieve a Subscription object based on its unique ID.
   * A Subscription defines a relation between a monday trigger and a Github repo.
   * @param {string} subscriptionId - The ID of the subscription to retrieve
   * @param {string=} mondayToken - The monday token of the user
   * @returns {Promise<Subscription>} - The fetched subscription
   */
  async getSubscription(subscriptionId, mondayToken) {
    try {
      const result = await this.storage.get(subscriptionId, { token: mondayToken });
      return JSON.parse(result.value);
    } catch (err) {
      logger.error('Failed to retrieve subscription', TAG, { subscriptionId, error: err.message });
    }
  }

  /**
   * Create a Subscription of your trigger.
   * The Subscription object defines a relation between a monday trigger and a Github repo.
   * @returns The Subscription that was created
   * @param attributes
   * @param {string} attributes.mondayWebhookUrl - The webhook URL that monday will send events to
   * @param {string} attributes.owner - The owner of the Github repo
   * @param {string} attributes.repo - The name of the Github repo
   * @param {string} attributes.mondayUserId - The monday user ID
   * @param {string=} mondayToken - The monday token of the user
   * @returns {Promise<Subscription>} - The Subscription that was created
   */
  async createSubscription(attributes, mondayToken) {
    const { mondayWebhookUrl, owner, repo, mondayUserId } = attributes;
    const subscriptionId = uuidv4();
    const subscription = {
      id: subscriptionId,
      active: true,
      mondayWebhookUrl,
      owner,
      repo
    };
    const stringifiedSubscription = JSON.stringify(subscription);

    try {
      await this.storage.set(subscriptionId, stringifiedSubscription, { token: mondayToken });
      await this.relationsStorage.set(subscriptionId, mondayUserId);
      return subscription;
    } catch (err) {
      logger.error('Failed to create subscription', TAG, { attributes, error: err.message });
    }
  }

  /**
   * Update an existing Subscription.
   * @param {string} subscriptionId - The ID of the subscription to update
   * @param {object} updates - The updates to apply to the subscription
   * @param {string=} updates.mondayWebhookUrl - The webhook URL that monday will send events to
   * @param {string=} updates.owner - The owner of the Github repo
   * @param {string=} updates.repo - The name of the Github repo
   * @param {number=} updates.webhookId - The ID of the webhook that was created in Github
   * @param {string=} mondayToken - The monday token of the user
   * @returns {Promise<Subscription>} - The Subscription that was updated
   */
  async updateSubscription(subscriptionId, updates, mondayToken) {
    const { mondayWebhookUrl, owner, repo, webhookId } = updates;
    const subscription = {
      id: subscriptionId,
      active: true,
      ...mondayWebhookUrl && { mondayWebhookUrl },
      ...owner && { owner },
      ...repo && { repo },
      ...webhookId && { webhookId }
    };

    try {
      const oldSubscription = await this.getSubscription(subscriptionId, mondayToken);
      const mergedSubscription = { ...oldSubscription, ...subscription };
      const stringifiedMergedSubscription = JSON.stringify(mergedSubscription);
      await this.storage.set(subscriptionId, stringifiedMergedSubscription, { token: mondayToken });
      return mergedSubscription;
    } catch (err) {
      logger.error('Failed to update subscription', TAG, { attributes, error: err.message });
    }
  }

  /**
   * Delete a Subscription.
   * @param {string} subscriptionId - The ID of the subscription to delete
   * @param {string=} mondayToken - The monday token of the user
   * @returns {Promise<Subscription>} - The Subscription that was deleted
   */
  async deleteSubscription(subscriptionId, mondayToken) {
    try {
      const subscription = await this.getSubscription(subscriptionId, mondayToken);
      await this.storage.delete(subscriptionId, { token: mondayToken });
      await this.relationsStorage.delete(subscriptionId);
      return subscription;
    } catch (err) {
      logger.error('Failed to delete subscription', TAG, { subscriptionId, error: err.message });
    }
  }

  /**
   * Retrieve user id by subscription id.
   * @param {string} subscriptionId - The ID of the subscription to delete
   * @returns {Promise<string>} - The user id
   */
  async getUserIdBySubscriptionId(subscriptionId) {
    try {
      const result = await this.relationsStorage.get(subscriptionId);
      return result?.value;
    } catch (err) {
      logger.error('Failed to get user id by subscription id', TAG, { subscriptionId, error: err.message });
    }
  }
}

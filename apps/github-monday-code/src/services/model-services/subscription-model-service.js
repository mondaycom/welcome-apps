import getDbModel from '../../db/models/index.js';
import logger from '../logger/index.js';

const TAG = 'subscription_model_service';
/**
 * Retrieve a Subscription object based on its unique ID.
 * A Subscription defines a relation between a monday trigger and a Github repo.
 */
export const getSubscription = async (subscriptionId) => {
  const Subscription = getDbModel('Subscription');
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    return subscription;
  } catch (err) {
    logger.error('Failed to retrieve subscription', TAG, { subscriptionId, error: err });
  }
};

/**
 * Create a Subscription of your trigger.
 * The Subscription object defines a relation between a monday trigger and a Github repo.
 * @returns The Subscription that was created
 */
export const createSubscription = async (attributes) => {
  const Subscription = getDbModel('Subscription');

  const { mondayWebhookUrl, owner, repo } = attributes;

  try {
    const newSubscription = await Subscription.create({
      active: true,
      mondayWebhookUrl,
      owner,
      repo,
    });
    return newSubscription;
  } catch (err) {
    logger.error('Failed to create subscription', TAG, { attributes, error: err });
  }
};

/**
 * Update an existing Subscription.
 */
export const updateSubscription = async (subscriptionId, updates) => {
  const Subscription = getDbModel('Subscription');

  const { mondayWebhookUrl, owner, repo, webhookId } = updates;
  try {
    const subscription = await Subscription.update(
      { mondayWebhookUrl, owner, repo, webhookId },
      {
        where: {
          id: subscriptionId,
        },
      }
    );
    return subscription;
  } catch (err) {
    logger.error('Failed to update subscription', TAG, { attributes, error: err });
  }
};

/**
 * Delete a Subscription.
 */
export const deleteSubscription = async (subscriptionId) => {
  const Subscription = getDbModel('Subscription');

  try {
    const subscription = await Subscription.update(
      { active: false },
      {
        where: {
          id: subscriptionId,
        },
      }
    );
    return subscription;
  } catch (err) {
    logger.error('Failed to delete subscription', TAG, { subscriptionId, error: err });
  }
};

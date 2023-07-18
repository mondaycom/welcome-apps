import db from '../../db/models/index.js';

const { Subscription } = db;
/**
 * Retrieve a Subscription object based on its unique ID.
 * A Subscription defines a relation between a monday trigger and a Github repo.
 */
const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await Subscription.findByPk(subscriptionId);
    return subscription;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Create a Subscription of your trigger.
 * The Subscription object defines a relation between a monday trigger and a Github repo.
 * @returns The Subscription that was created
 */
const createSubscription = async (attributes) => {
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
    console.error(err);
  }
};

/**
 * Update an existing Subscription.
 */
const updateSubscription = async (subscriptionId, updates) => {
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
    console.error(err);
  }
};

/**
 * Delete a Subscription.
 */
const deleteSubscription = async (subscriptionId) => {
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
    console.error(err);
  }
};

module.exports = {
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};

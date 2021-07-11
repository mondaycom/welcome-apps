const { Subscription } = require('../../db/models');

const getSubscription = async (subscriptionId) => {
  try {
    return await Subscription.findByPk(subscriptionId);
  } catch (err) {
    console.error(err);
  }
};

const createSubscription = async (attributes) => {
  const { mondayWebhookUrl } = attributes;
  try {
    return await Subscription.create({
      active: true,
      mondayWebhookUrl,
    });
  } catch (err) {
    console.error(err);
  }
};

const updateSubscription = async (subscriptionId, updates) => {
  const { mondayWebhookUrl, webhookId } = updates;
  try {
    return await Subscription.update(
      { mondayWebhookUrl, webhookId },
      {
        where: {
          id: subscriptionId,
        },
      }
    );
  } catch (err) {
    console.error(err);
  }
};

const deleteSubscription = async (subscriptionId) => {
  try {
    return await Subscription.update(
      { active: false },
      {
        where: {
          id: subscriptionId,
        },
      }
    );
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

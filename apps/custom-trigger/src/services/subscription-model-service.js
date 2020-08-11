const { Subscription } = require("../db/models");

class SubscriptionModelService {

  // Create a new subscription in the database
  static async createSubscription(webhookUrl, subscriptionId) {
    try {
      const newSubscription = await Subscription.create({
        id: subscriptionId,
        active: true,
        created_at: new Date(),
        webhook_url: webhookUrl
      })
    }
    catch (err) {
      console.log(err);
    }
  }

  // Soft delete a subscription from the database (active: false)
  static async removeSubscription(subscriptionId) {
    try {
      // mark active as false
      const subscription = await Subscription.update({ active: false }, {
        where: {
          id: subscriptionId
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }
}

module.exports = SubscriptionModelService;

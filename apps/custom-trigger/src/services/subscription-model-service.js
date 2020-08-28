const { Subscription } = require("../db/models");

class SubscriptionModelService {

  // Create a new subscription in the database
  static async createSubscription(webhookUrl, subscriptionId) {
    try {
      const newSubscription = await Subscription.create({
        subscription_id: subscriptionId,
        active: true,
        webhook_url: webhookUrl
      });
      // console.log(newSubscription)
      return newSubscription.dataValues.id;
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
          subscription_id: subscriptionId
        }
      });
      console.log(subscription);
      return subscription;
    }
    catch (err) {
      console.log(err);
    }
  }

  static async getActiveSubscriptions() {
    try {
      const subscriptions = await Subscription.findAll({
        where: {
          active: true
        }
      });
      return subscriptions; 
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = SubscriptionModelService;

const { Subscriptions } = require('../db/models');

const createSubscription = async (webhookUrl, subscriptionId, groupId) => {
  try {
    const newSubscription = await Subscriptions.create({
      id: subscriptionId,
      active: true,
      webhookUrl,
      groupId
    });
    return newSubscription.dataValues.id;
  } catch (err) {
    console.log(err);
  }
};

const removeSubscription = async subscriptionId => {
  try {
    return await Subscriptions.update({ active: false }, {
      where: {
        id: subscriptionId
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getActiveSubscriptions = async (where = {}) => {
  try {
    return await Subscriptions.findAll({
      where: {
        active: true,
        ...where
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createSubscription,
  removeSubscription,
  getActiveSubscriptions
};

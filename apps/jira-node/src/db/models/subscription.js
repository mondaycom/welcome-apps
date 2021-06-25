'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model{}
  Subscription.init(
    {
      active: DataTypes.BOOLEAN,
      mondayWebhookUrl: DataTypes.STRING,
      webhookId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Subscription',
    }
  );
  return Subscription;
};

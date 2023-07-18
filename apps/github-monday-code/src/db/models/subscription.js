'use strict';
import { Model } from 'sequelize';

const SubscriptionFactory = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      // define association here
    }
  }
  Subscription.init(
    {
      active: DataTypes.BOOLEAN,
      mondayWebhookUrl: DataTypes.STRING,
      webhookId: DataTypes.INTEGER,
      owner: DataTypes.STRING,
      repo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Subscription',
    }
  );
  return Subscription;
};

export default SubscriptionFactory;

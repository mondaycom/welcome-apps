'use strict';
import { Model } from 'sequelize';

export const subscriptionModelName = 'Subscription';

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
      modelName: subscriptionModelName,
    }
  );
  return Subscription;
};

export default SubscriptionFactory;

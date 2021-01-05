'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    subscription_id: {
      type: DataTypes.STRING
    },
    active: DataTypes.BOOLEAN,
    webhook_url: DataTypes.STRING
  }, {
    // options
  });
  Subscription.associate = function(models) {
    // associations can be defined here
  };
  return Subscription;
};

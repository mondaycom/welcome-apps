'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    active: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    webhook_url: DataTypes.STRING
  }, {
    // options
  });
  Subscription.associate = function(models) {
    // associations can be defined here
  };
  return Subscription;
};

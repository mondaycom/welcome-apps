'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscriptions extends Model {
    static associate(models) {
      // define association here
    }
  }
  Subscriptions.init({
    webhookUrl: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    groupId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subscriptions',
  });
  return Subscriptions;
};

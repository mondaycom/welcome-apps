'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Connection extends Model {
    static associate(models) {
      // define association here
    }
  }
  Connection.init(
    {
      userId: DataTypes.STRING,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Connection',
    }
  );
  return Connection;
};

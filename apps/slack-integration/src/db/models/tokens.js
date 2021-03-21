'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    static associate(models) {
      // define association here
    }
  }
  Tokens.init({
    token: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tokens'
  });
  return Tokens;
};

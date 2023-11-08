/* eslint-disable max-len */
'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeenMessage extends Model {
    static associate(models) {
      SeenMessage.belongsTo(models.Message, {foreignKey: 'messageId', as: 'seenUsers'});
      SeenMessage.belongsTo(models.User, {foreignKey: 'userId', as: 'seenBy'});
    }
  }
  SeenMessage.init({
    messageId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'SeenMessage',
  });
  return SeenMessage;
};

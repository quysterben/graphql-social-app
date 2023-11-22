/* eslint-disable max-len */
'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.hasMany(models.SeenMessage, {foreignKey: 'messageId', as: 'seenUsers'});
      Message.hasMany(models.MessageImage, {foreignKey: 'messageId', as: 'messageImages'})
      Message.belongsTo(models.User, {foreignKey: 'userId', as: 'author'});
    }
  }
  Message.init({
    conversationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};

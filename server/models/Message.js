/* eslint-disable max-len */
'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Conversation, {foreignKey: 'conversationId', as: 'messages'});
      Message.hasMany(models.SeenMessage, {foreignKey: 'messageId', as: 'seenUsers'});

      Message.belongsTo(models.User, {foreignKey: 'userId', as: 'author'});
    }
  }
  Message.init({
    conversationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
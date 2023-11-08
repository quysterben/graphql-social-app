/* eslint-disable max-len */
'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.hasMany(models.Message, {foreignKey: 'conversationId', as: 'messages'});
      Conversation.hasMany(models.ConversationMember, {foreignKey: 'conversationId', as: 'conversationMembers'});
    }
  }
  Conversation.init({
    name: DataTypes.STRING,
    isGroup: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};

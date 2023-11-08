/* eslint-disable max-len */
'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConversationMember extends Model {
    static associate(models) {
      ConversationMember.belongsTo(models.User, {foreignKey: 'userId', as: 'users'});
      ConversationMember.belongsTo(models.Conversation, {foreignKey: 'conversationId', as: 'conversationMembers'});
    }
  }
  ConversationMember.init({
    conversationId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ConversationMember',
  });
  return ConversationMember;
};

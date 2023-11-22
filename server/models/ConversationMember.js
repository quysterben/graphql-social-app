/* eslint-disable max-len */
'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConversationMember extends Model {
    static associate(models) {}
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

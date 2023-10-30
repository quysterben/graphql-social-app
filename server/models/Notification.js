/* eslint-disable new-cap */
'use strict'
const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
        Notification.belongsTo(models.User, {
            foreignKey: 'userToNotify',
            as: 'toNotify',
        })
        Notification.belongsTo(models.User, {
            foreignKey: 'userWhoTriggered',
            as: 'triggered',
        })
    }
  }
  Notification.init({
    userToNotify: DataTypes.INTEGER,
    userWhoTriggered: DataTypes.INTEGER,
    eventType: DataTypes.ENUM('like', 'comment', 'reply', 'post'),
    objectId: DataTypes.INTEGER,
    seenByUser: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Notification',
  })
  return Notification
}

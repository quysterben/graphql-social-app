/* eslint-disable new-cap */
'use strict'
const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    static associate(models) {
      Friendship.belongsTo(models.User,
          {foreignKey: 'user1_id', as: 'friends1'})
      Friendship.belongsTo(models.User,
          {foreignKey: 'user2_id', as: 'friends2'})
    }
  }
  Friendship.init({
    user1_id: DataTypes.INTEGER,
    user2_id: DataTypes.INTEGER,
    status: DataTypes.ENUM(1, 2, 3),
  }, {
    sequelize,
    modelName: 'Friendship',
  })
  return Friendship
}

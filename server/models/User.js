'use strict'

const bcrypt = require('bcryptjs')

const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {foreignKey: 'userId', as: 'posts'})
      User.hasMany(models.Comment, {foreignKey: 'userId', as: 'comments'})
      User.hasMany(models.Friendship, {foreignKey: 'user1_id', as: 'friends1'})
      User.hasMany(models.Friendship, {foreignKey: 'user2_id', as: 'friends2'})
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.INTEGER,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  }, {
    defaultScope: {
      rawAttributes: {exclude: ['password']},
    },
  })
  User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash()
  })
  User.prototype.generatePasswordHash = function() {
    if (this.password) {
      return bcrypt.hash(this.password, 10)
    }
  }
  return User
}
